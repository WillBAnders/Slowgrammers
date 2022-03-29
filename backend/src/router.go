package src

import (
	"strings"
	"time"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var Router *gin.Engine

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
	Router.GET("/profile", getProfile)
	Router.PATCH("/profile", patchProfile)
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
//     user: User {
//       username: String
//       firstname: String
//       lastname: String
//       email: String
//       phone: String
//     }
//     rating: Float
//     bio: String
//     availability: []String
//   }
// }
// Error Schema: {
//   error: String
// }
func getCoursesCode(c *gin.Context) {
	code := c.Params.ByName("code")

	var courses []Course
	DB.Limit(1).Find(&courses, "code = ?", code)
	if len(courses) != 1 {
		c.JSON(404, gin.H{
			"error": "Course " + code + " not found.",
		})
		return
	}

	//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
	var tutorings []Tutoring
	DB.Joins("Tutor").Joins("LEFT JOIN users User ON id = Tutor__user_id").Preload("Tutor.User").Order("User.username").Find(&tutorings, "course_id = ?", courses[0].ID)
	tutors := make([]gin.H, len(tutorings))
	for i, tutoring := range tutorings {
		//TODO: Limit the amount of data being returned
		tutors[i] = gin.H{
			"user":         tutoring.Tutor.User,
			"rating":       tutoring.Tutor.Rating,
			"bio":          tutoring.Tutor.Bio,
			"availability": strings.FieldsFunc(tutoring.Tutor.Availability, func(r rune) bool { return r == ',' }), //TODO
		}
	}

	c.JSON(200, gin.H{
		"course": courses[0],
		"tutors": tutors,
	})
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
	DB.Joins("User").Order("User__username").Find(&tutors)

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
//     user: User {
//       username: String
//       firstname: String
//       lastname: String
//       email: String
//       phone: String
//     }
//     rating: Float
//     bio: String
//     availability: []String
//   }
//   courses: []Course {
//     code: String
//     name: String
//   }
// }
// Error Schema: {
//   error: String
// }
func getTutorsUsername(c *gin.Context) {
	username := c.Params.ByName("username")

	var tutors []Tutor
	DB.Joins("User").Limit(1).Find(&tutors, "User__username = ?", username)
	if len(tutors) != 1 {
		c.JSON(404, gin.H{
			"error": "Tutor " + username + " not found.",
		})
		return
	}

	//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
	var tutorings []Tutoring
	DB.Joins("Course").Order("Course__code").Find(&tutorings, "tutor_id = ?", tutors[0].UserID)
	//TODO: Error here with empty tutorings?
	courses := make([]Course, len(tutorings))
	for i, tutoring := range tutorings {
		courses[i] = tutoring.Course
	}

	c.JSON(200, gin.H{
		"tutor": gin.H{
			"user":         tutors[0].User,
			"rating":       tutors[0].Rating,
			"bio":          tutors[0].Bio,
			"availability": strings.FieldsFunc(tutors[0].Availability, func(r rune) bool { return r == ',' }), //TODO
		},
		"courses": courses,
	})
}

type AuthBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Handler for /signup. Takes a username and password and creates a new user
// account. Sets a jwt session to authenticate the user. Returns an empty
// object. Errors if:
//
//  - The body has missing/unknown fields (400)
//  - The username already exists (401)
//  - A server issue prevents creating a JWT (500)
//     - The user is still successfully created
//
// Body Schema: {
//   username: String
//   password: String
// }
// Response Schema: {}
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
	DB.Create(&User{Username: body.Username, Password: string(hash), FirstName: "Anonymous", LastName: "", Email: "unknown email", Phone: "unknown number"})

	token, err := CreateJWT(body.Username)
	if err != nil {
		//TODO: Use status 207 to indicate the account was successfully created?
		c.JSON(500, gin.H{
			"error": "Unable to create JWT: " + err.Error() + ".",
		})
		return
	}
	c.SetCookie("jwt", token, int(24*time.Hour.Seconds()), "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /signin. Takes a username and password and logs in an existing
// user account. Sets a jwt session to authenticate the user. Returns an empty
// object. Errors if:
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
// Response Schema: {}
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

	token, err := CreateJWT(body.Username)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to create JWT: " + err.Error() + ".",
		})
		return
	}
	c.SetCookie("jwt", token, int(24*time.Hour.Seconds()), "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /signout. Signs out the user if currently authenticated. Returns
// an empty object.
//
// Response Schema: {}
func postSignout(c *gin.Context) {
	c.SetCookie("jwt", "", 0, "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /profile. Returns the user profile for the authenticated user.
// Errors if:
//
//  - There is no authenticated user (401)
//  - A server issue prevents parsing the JWT (500)
//  - The user does not exist in the database (500)
//
// Response Schema: {
//   user: User {
//     username: String
//     firstname: String
//     lastname: String
//     email: String
//     phone: String
//   }
// }
// Error Schema: {
//   error: String
// }
func getProfile(c *gin.Context) {
	token, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(401, gin.H{
			"error": "Requires an authenticated user.",
		})
		return
	}

	claims, err := ParseJWT(token)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to parse JWT: " + err.Error() + ".",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", claims.Username)
	if len(users) != 1 {
		c.JSON(500, gin.H{
			"error": "User " + claims.Username + " is authenticated but does not exist in the database.",
		})
		return
	}

	c.JSON(200, gin.H{
		"user": users[0],
	})
}


//not all of this is needed to make an update, at least according to the guide. We shall see.
type ProfileUpdateData struct { 
	ID        uint   `json:"-"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
}

// ADD DESCRIPTION
func patchProfile(c *gin.Context) {
	
	token, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(401, gin.H{
			"error": "Requires an authenticated user.",
		})
		return
	}
	
	claims, err := ParseJWT(token)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to parse JWT: " + err.Error() + ".",
		})
		return
	}
	
	var users []User
	//add error checking for nonexisting user 
	//Note for self: https://blog.logrocket.com/how-to-build-a-rest-api-with-golang-using-gin-and-gorm/
	
	var edits ProfileUpdateData
	if err := c.ShouldBindJSON(&edits); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	DB.Find(&users, "username = ?", claims.Username)
	DB.Model(&users[0]).Updates(edits)
	
	c.JSON(200, gin.H{})
}
