package main

import (
	"backend/src"
)

func main() {
	//TODO: Error handling
	src.InitDatabase("database.db")

	courses := []src.Course{
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
	src.DB.Create(courses)

	tutors := []src.Tutor{
		{Username: "Alice", Rating: 5.0},
		{Username: "Bob", Rating: 4.5},
		{Username: "Clair", Rating: 2.0},
		{Username: "David", Rating: 0.0},
	}
	src.DB.Create(tutors)
	
	availability := []src.Availability{
		{Tutor: tutors[0], Day: "Monday"},
		{Tutor: tutors[1], Day: "Tuesday"},
		{Tutor: tutors[1], Day: "Wendsday"},
		{Tutor: tutors[2], Day: "Monday"},
		{Tutor: tutors[2], Day: "Thursday"},
		{Tutor: tutors[3], Day: "Friday"},
	}
	src.DB.Create(availability)

	tutoring := []src.Tutoring{
		{Tutor: tutors[0], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[1]},
		{Tutor: tutors[2], Course: courses[2]},
	}
	src.DB.Create(tutoring)
	
	users := []src.User{
		{Username: "Eve"},
		{Username: "Fred"},
		{Username: "Greta"},
		{Username: "Henry"},
	}
	src.DB.Create(users)
}
