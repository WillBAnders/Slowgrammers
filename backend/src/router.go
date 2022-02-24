package src

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var Router *gin.Engine

func InitRouter() {
	Router = gin.Default()
	Router.GET("/courses", getCourses)
	Router.GET("/courses/:code", getCoursesCode)
	Router.GET("/tutors", getTutors)
	Router.GET("/tutors/:username", getTutorsUsername)
	Router.POST("/signup", postSignup)
	Router.POST("/signin", postSignin)
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
	DB.Limit(1).Find(&tutors, "username = ?", username)
	if len(tutors) == 1 {
		//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
		var tutorings []Tutoring
		DB.Joins("Course").Order("Course__code").Find(&tutorings, "tutor_id = ?", tutors[0].ID)
		courses := []Course{}
		for _, tutoring := range tutorings {
			courses = append(courses, tutoring.Course)
		}
		c.JSON(200, gin.H{
			"tutor":   tutors[0],
			"courses": courses,
		})
	} else {
		c.JSON(404, gin.H{
			"error": "Tutor " + username + " not found.",
		})
	}
}

type AuthBody struct {
<<<<<<< HEAD
	Username string `json:"username"`
	Password string `json:"password"`
}

=======
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
>>>>>>> 34095bcc8b060e94d5afa8e21e81382a4ddebb5f
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

<<<<<<< HEAD
	c.JSON(200, gin.H{})
}

=======
	token, err := CreateJWT(body.Username)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to create JWT: " + err.Error() + ".",
		})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
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
>>>>>>> 34095bcc8b060e94d5afa8e21e81382a4ddebb5f
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

<<<<<<< HEAD
	c.JSON(200, gin.H{})
=======
	token, err := CreateJWT(body.Username)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to create JWT.",
		})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
>>>>>>> 34095bcc8b060e94d5afa8e21e81382a4ddebb5f
}
