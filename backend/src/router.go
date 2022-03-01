package src

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var Router *gin.Engine
var secret = "secret"

func InitRouter() {
	Router = gin.Default()
	Router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true}))
	Router.GET("/courses", getCourses)
	Router.GET("/courses/:code", getCoursesCode)
	Router.GET("/tutors", getTutors)
	Router.GET("/tutors/:username", getTutorsUsername)
	Router.POST("/signup", postSignup)
	Router.POST("/signin", postSignin)
	Router.POST("/signout", postSignout)
	Router.GET("/user", getUser)
	Router.GET("/users/:username", getUsersUsername)
}

// Handler for /courses. Returns all courses ordered by code.
//
// Response Schema: {
//   courses: []Course {
//     code: String
//     name: String
//   }
// }
func getCourses(c *gin.Context) {
	//TODO: Pagination support
	var courses []Course
	DB.Order("code").Find(&courses)
	c.JSON(200, gin.H{
		"courses": courses,
	})
}

// Handler for /courses/:code. Returns the course identified by :code along
// with all tutors ordered by username. If the course :code is not defined,
// returns a 404 with an error message.
//
// Response Schema: {
//   course: Course {
//     code: String
//     name: String
//   }
//   tutors: []Tutor {
//     username: String
//   }
// }
// Error Schema: {
//   error: String
// }
func getCoursesCode(c *gin.Context) {
	code := c.Params.ByName("code")
	var courses []Course
	DB.Limit(1).Find(&courses, "code = ?", code)
	if len(courses) == 1 {
		//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
		var tutorings []Tutoring
		DB.Joins("Tutor").Order("Tutor__username").Find(&tutorings, "course_id = ?", courses[0].ID)
		tutors := []Tutor{}
		for _, tutoring := range tutorings {
			tutors = append(tutors, tutoring.Tutor)
		}
		c.JSON(200, gin.H{
			"course": courses[0],
			"tutors": tutors,
		})
	} else {
		c.JSON(404, gin.H{
			"error": "Course " + code + " not found.",
		})
	}
}

// Handler for /tutors. Returns all tutors ordered by username.
//
// Response Schema: {
//   tutors: []Tutor {
//     username: String
//   }
// }
func getTutors(c *gin.Context) {
	//TODO: Pagination support
	var tutors []Tutor
	DB.Order("username").Find(&tutors)
	c.JSON(200, gin.H{
		"tutors": tutors,
	})
}

// Handler for /tutors/:username. Returns the tutor identified by :username
// along with all courses tutored ordered by code. If the tutor :username is
// not defined, returns a 404 with an error message.
//
// Response Schema: {
//   tutor: Tutor {
//     username: String
//	   rating: Float
//	   bio: String
//   }
//   profile: User {
//     username: String
//	   firstname: String
//	   lastname: String
//	   email: String
//	   phone: String
//   }
//   courses: []Course {
//     code: String
//     name: String
//   }
//   availability: []String {}
// }
// Error Schema: {
//   error: String
// }
func getTutorsUsername(c *gin.Context) {
	username := c.Params.ByName("username")
	var tutors []Tutor
	DB.Limit(1).Find(&tutors, "username = ?", username)
	if len(tutors) == 1 {
		//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
		var tutorings []Tutoring
		DB.Joins("Course").Order("Course__code").Find(&tutorings, "tutor_id = ?", tutors[0].ID)
		var availability []Availability
		DB.Joins("Availability").Select("day").Find(&availability, "tutor_id = ?", tutors[0].ID)
		var user []User
		DB.Where("username = ?", tutors[0].Username).Find(&user)
		courses := []Course{}
		for _, tutoring := range tutorings {
			courses = append(courses, tutoring.Course)
		}
		availabilityList := []string{} //make([]string, 5)
		for _, openings := range availability {
			availabilityList = append(availabilityList, openings.Day)
		}
		c.JSON(200, gin.H{
			"tutor":        tutors[0],
			"profile":      user,
			"courses":      courses,
			"availability": availabilityList,
		})
	} else {
		c.JSON(404, gin.H{
			"error": "Tutor " + username + " not found.",
		})
	}
}

type AuthBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Handler for /signup. Takes a username and password and creates a new user
// account, returning a JWT. Errors if:
//
//  - The body has missing/unknown fields (400)
//  - The username already exists (401)
//  - A server issue prevents creating a JWT (500)
//
// Body Schema: {
//   username: String
//   password: String
// }
// Response Schema: {
//   token: JWT
// }
// Error Schema: {
//   error: String
// }
func postSignup(c *gin.Context) {
	//TODO: Error on unknown fields
	var body AuthBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request: " + err.Error() + ".",
		})
		return
	}

	//TODO: Validate username/password

	var users []User
	DB.Limit(1).Find(&users, "username = ?", body.Username)
	if len(users) != 0 {
		c.JSON(401, gin.H{
			"error": "User " + body.Username + " already exists.",
		})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	DB.Create(&User{Username: body.Username, Password: string(hash)})
}

// Handler for /signin. Takes a username and password and logs in an existing
// user account, returning a JWT. Errors if:
//
//  - The body has missing/unknown fields (400)
//  - The username does not exist (401)
//  - The password is invalid (401)
//  - A server issue prevents creating a JWT (500)
//
// Body Schema: {
//   username: String
//   password: String
// }
// Response Schema: {
//   token: JWT
// }
// Error Schema: {
//   error: String
// }
func postSignin(c *gin.Context) {
	//TODO: Error on unknown fields
	var body AuthBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request: " + err.Error() + ".",
		})
		return
	}

	//TODO: Validate username/password

	var users []User
	DB.Limit(1).Find(&users, "username = ?", body.Username)
	if len(users) != 1 {
		c.JSON(401, gin.H{
			"error": "User " + body.Username + " not found.",
		})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(users[0].Password), []byte(body.Password)) != nil {
		c.JSON(401, gin.H{
			"error": "Invalid password.",
		})
	}

	ss, err := CreateJWT(body.Username)

	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to create JWT.",
		})
		return
	}

	cookie, err := c.Cookie("jwt")

	if err == nil {
		fmt.Printf("Cookie not able to be setup in signin: %s", cookie)
		return
	}
	c.SetCookie("jwt", ss, 3600*24, "/", "", false, true)

	c.JSON(200, gin.H{
		"token": ss,
	})
}

//TODO make docs
func getUser(c *gin.Context) {
	cookie, err := c.Cookie("jwt")

	if err != nil {
		fmt.Printf("cookie not recieved get user\n")
	}
	//will have to change the secret in the future
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		c.JSON(200, gin.H{
			"message": "Unauthenticated.",
		})
		return
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var users []User

	DB.Limit(1).Find(&users, "username = ?", claims.Issuer)

	c.JSON(200, users)
	return
}

//TODO make docs
func postSignout(c *gin.Context) {

	c.SetCookie("jwt", "", -1, "", "", false, true)

	cookie, err := c.Cookie("jwt")

	if err != nil {
		fmt.Printf("cookie not recieved signout: %s , %s \n", cookie, err)
	}

	c.JSON(200, gin.H{
		"message": "success",
	})
	return
}

// Handler for /users/:username. Returns the user identified by :username
// If the tutor :username is not defined, returns a 404 with an error message.
//
// Response Schema: {
//   user: User {
//     username: String
//   }
// }
// Error Schema: {
//   error: String
// }
func getUsersUsername(c *gin.Context) {
	username := c.Params.ByName("username")
	var users []User
	DB.Limit(1).Find(&users, "username = ?", username)
	if len(users) == 1 {
		c.JSON(200, gin.H{
			"user": users[0],
		})
	} else {
		c.JSON(404, gin.H{
			"error": "User " + username + " not found.",
		})
	}
}
