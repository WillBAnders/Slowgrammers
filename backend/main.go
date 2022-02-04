package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"models"
)

func main() {
	//TODO: Initialization errors
	db, _ := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	_ = db.AutoMigrate(&models.Course{})

	//TODO: Test data initialization script
	/*
		courses := []Course{
			{Code: "cop-3502", Name: "Programming Fundamentals 1"},
			{Code: "cop-3503", Name: "Programming Fundamentals 2"},
			{Code: "cot-3100", Name: "Applications of Discrete Structures"},
			{Code: "cop-3530", Name: "Data Structures and Algorithms"},
			{Code: "cen-3031", Name: "Introduction to Computer Organization"},
			{Code: "cda-3101", Name: "Introduction to Software Engineering"},
			{Code: "cis-4301", Name: "Information and Database Systems"},
			{Code: "cop-4020", Name: "Programming Language Concepts"},
			{Code: "cop-4600", Name: "Operating Systems"},
			{Code: "cnt-4007", Name: "Computer Network Fundamentals"},
		}
		db.Create(courses)

		tutors := []Tutor{
			{Username: "Alice"},
			{Username: "Bob"},
			{Username: "Clair"},
			{Username: "David"},
		}
		db.Create(tutors)

		tutoring := []Tutoring{
			{Tutor: tutors[0], Course: courses[0]},
			{Tutor: tutors[1], Course: courses[0]},
			{Tutor: tutors[1], Course: courses[1]},
			{Tutor: tutors[2], Course: courses[2]},
		}
		db.Create(tutoring)
	*/

	r := gin.Default()

	r.GET("/courses", func(c *gin.Context) {
		//TODO: Pagination support
		var courses []models.Course
		db.Order("code").Find(&courses)
		c.JSON(200, gin.H{
			"courses": courses,
		})
	})

	r.GET("/courses/:code", func(c *gin.Context) {
		code := c.Params.ByName("code")
		var courses []models.Course
		db.Limit(1).Find(&courses, "code = ?", code)
		if len(courses) == 1 {
			//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
			var tutorings []Tutoring
			db.Preload("Tutor").Find(&tutorings, "course_id = ?", courses[0].ID)
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
	})

	r.GET("/tutors", func(c *gin.Context) {
		//TODO: Pagination support
		var tutors []Tutor
		db.Order("username").Find(&tutors)
		c.JSON(200, gin.H{
			"tutors": tutors,
		})
	})

	r.GET("/tutors/:username", func(c *gin.Context) {
		username := c.Params.ByName("username")
		var tutors []Tutor
		db.Limit(1).Find(&tutors, "username = ?", username)
		if len(tutors) == 1 {
			//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
			var tutorings []Tutoring
			db.Preload("Course").Find(&tutorings, "tutor_id = ?", tutors[0].ID)
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
	})

	r.Run(":8080")
}
