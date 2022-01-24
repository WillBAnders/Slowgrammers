package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Course struct {
	ID   uint   `gorm:"primaryKey" json:"-"`
	Code string `gorm:"unique,not null" json:"code"`
	Name string `gorm:"not null" json:"name"`
}

func main() {
	//TODO: Initialization errors
	db, _ := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	_ = db.AutoMigrate(&Course{})

	//TODO: Test data initialization script
	/*
		db.Create(&Course{Code: "COP 3502", Name: "Programming Fundamentals 1"})
		db.Create(&Course{Code: "COP 3503", Name: "Programming Fundamentals 2"})
		db.Create(&Course{Code: "COT 3100", Name: "Applications of Discrete Structures"})
		db.Create(&Course{Code: "COP 3530", Name: "Data Structures and Algorithms"})
		db.Create(&Course{Code: "CEN 3031", Name: "Introduction to Computer Organization"})
		db.Create(&Course{Code: "CDA 3101", Name: "Introduction to Software Engineering"})
		db.Create(&Course{Code: "CIS 4301", Name: "Information and Database Systems"})
		db.Create(&Course{Code: "COP 4020", Name: "Programming Language Concepts"})
		db.Create(&Course{Code: "COP 4600", Name: "Operating Systems"})
		db.Create(&Course{Code: "CNT 4007", Name: "Computer Network Fundamentals"})
	*/

	r := gin.Default()
	r.GET("/courses", func(c *gin.Context) {
		//TODO: Pagination support
		var courses []Course
		db.Order("code").Find(&courses)
		c.JSON(200, gin.H{
			"courses": courses,
		})
	})
	r.Run(":8080")
}
