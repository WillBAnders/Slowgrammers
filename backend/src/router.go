package src

import (
	"github.com/gin-gonic/gin"
)

var Router *gin.Engine

func InitRouter() {
	Router = gin.Default()
	Router.GET("/courses", getCourses)
	Router.GET("/courses/:code", getCoursesCode)
	Router.GET("/tutors", getTutors)
	Router.GET("/tutors/:username", getTutorsUsername)
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
			"user":   users[0],
		})
	} else {
		c.JSON(404, gin.H{
			"error": "User " + username + " not found.",
		})
	}
}

