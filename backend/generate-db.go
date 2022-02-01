package main

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
)

type Course struct {
	ID   uint   `gorm:"primaryKey" json:"-"`
	Code string `gorm:"unique,not null" json:"code"`
	Name string `gorm:"not null" json:"name"`
}

type Tutor struct {
	ID       uint   `gorm:"primaryKey" json:"-"`
	Username string `gorm:"unique,not null" json:"username"`
}

type Tutoring struct {
	TutorID  uint   `json:"-"`
	Tutor    Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	CourseID uint   `json:"-"`
	Course   Course `gorm:"foreignKey:CourseID" json:"course"`
}

func main() {
	err := os.Remove("database.db") //remove old database, if needed
	if err == nil {
		fmt.Println("Deleting old database")
	}
	
	fmt.Println("Creating new database")
	db, _ := gorm.Open(sqlite.Open("database.db"), &gorm.Config{}) //create new db
	_ = db.AutoMigrate(&Course{}, &Tutor{}, &Tutoring{}) //set up schema

	fmt.Println("Populating database")
	
	//add tuples for courses
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
	
	//add tuples for tutors
	tutors := []Tutor{
		{Username: "Alice"},
		{Username: "Bob"},
		{Username: "Clair"},
		{Username: "David"},
	}
	db.Create(tutors)
	
	//add tuples for tutoring options
	tutoring := []Tutoring{
		{Tutor: tutors[0], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[1]},
		{Tutor: tutors[2], Course: courses[2]},
	}
	db.Create(tutoring)
}
