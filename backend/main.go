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
		db.Create(&Course{Code: "cop-3502", Name: "Programming Fundamentals 1"})
		db.Create(&Course{Code: "cop-3503", Name: "Programming Fundamentals 2"})
		db.Create(&Course{Code: "cot-3100", Name: "Applications of Discrete Structures"})
		db.Create(&Course{Code: "cop-3530", Name: "Data Structures and Algorithms"})
		db.Create(&Course{Code: "cen-3031", Name: "Introduction to Computer Organization"})
		db.Create(&Course{Code: "cda-3101", Name: "Introduction to Software Engineering"})
		db.Create(&Course{Code: "cis-4301", Name: "Information and Database Systems"})
		db.Create(&Course{Code: "cop-4020", Name: "Programming Language Concepts"})
		db.Create(&Course{Code: "cop-4600", Name: "Operating Systems"})
		db.Create(&Course{Code: "cnt-4007", Name: "Computer Network Fundamentals"})
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
			c.JSON(200, gin.H{
				"course": courses[0],
			})
		} else {
			c.JSON(404, gin.H{
				"error": "Course " + code + " not found.",
			})
		}
	})

	r.Run(":8080")
}
