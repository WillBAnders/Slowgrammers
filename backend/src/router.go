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
}

func getCourses(c *gin.Context) {
	//TODO: Pagination support
	var courses []Course
	DB.Order("code").Find(&courses)
	c.JSON(200, gin.H{
		"courses": courses,
	})
}

func getCoursesCode(c *gin.Context) {
	code := c.Params.ByName("code")
	var courses []Course
	DB.Limit(1).Find(&courses, "code = ?", code)
	if len(courses) == 1 {
		//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
		var tutorings []Tutoring
		DB.Preload("Tutor").Find(&tutorings, "course_id = ?", courses[0].ID)
		var tutors []Tutor
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

func getTutors(c *gin.Context) {
	//TODO: Pagination support
	var tutors []Tutor
	DB.Order("username").Find(&tutors)
	c.JSON(200, gin.H{
		"tutors": tutors,
	})
}

func getTutorsUsername(c *gin.Context) {
	username := c.Params.ByName("username")
	var tutors []Tutor
	DB.Limit(1).Find(&tutors, "username = ?", username)
	if len(tutors) == 1 {
		//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
		var tutorings []Tutoring
		DB.Preload("Course").Find(&tutorings, "tutor_id = ?", tutors[0].ID)
		var courses []Course
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
