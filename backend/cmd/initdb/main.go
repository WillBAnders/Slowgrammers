package main

import (
	"backend/src"
)

func main() {
	//TODO: Error handling
	src.InitDatabase("database.db")

	users := []src.User{
		{Username: "Alice", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Alice", LastName: "Smith", Email: "alicemsmith@gmail.com", Phone: "(567) 890-1234"},
		{Username: "Bob", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Bob", LastName: "Crachett", Email: "bobbyc@gmail.com", Phone: "(678) 901-2345"},
		{Username: "Clair", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Clair", LastName: "Carson", Email: "claircarson@gmail.com", Phone: "(789) 012-3456"},
		{Username: "David", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "David", LastName: "Davidson", Email: "davidsquared@outlook.com", Phone: "(890) 123-4567"},
		{Username: "Eve", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Evangeline", LastName: "Mae", Email: "emae@gmail.com", Phone: "(123) 456-7890"},
		{Username: "Fred", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Fred", LastName: "Flintstone", Email: "freddyflint@aol.com", Phone: "(234) 567-8901"},
		{Username: "Greta", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Greta", LastName: "Glade", Email: "gg@hotmail.com", Phone: "(345) 678-9012"},
		{Username: "Henry", Password: "$2a$10$pxi/o3ODHt.dDJ/GLtBaNOibH78yBYYtvjrCAJ3.3jk1JcKhi6Q7e", FirstName: "Henry", LastName: "Hue", Email: "henrytheeight@ufl.edu", Phone: "(456) 789-0123"},
	}
	src.DB.Create(users)

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
		{
			User:         users[0],
			Rating:       5.0,
			Bio:          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			Availability: []src.Availability{},
		}, {
			User:   users[1],
			Rating: 4.5,
			Bio:    "Once upon a midnight dreary, while I pondered, weak and weary, Over many a quaint and curious volume of forgotten lore—While I nodded, nearly napping, suddenly there came a tapping, As of some one gently rapping, rapping at my chamber door. `Tis some visitor,` I muttered, `tapping at my chamber door—Only this and nothing more.`",
			Availability: []src.Availability{
				{Day: "Monday", Start: "08:30", End: "17:00"},
			},
		}, {
			User:   users[2],
			Rating: 2.0,
			Bio:    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way--in short, the period was so far like the present period that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.",
			Availability: []src.Availability{
				{Day: "Tuesday", Start: "18:00", End: "21:00"},
				{Day: "Thursday", Start: "18:00", End: "21:00"},
			},
		}, {
			User:   users[3],
			Rating: 0.0,
			Bio:    "There once was a ship that put to sea. The name of the ship was the Billy of Tea. The winds blew up, her bow dipped down. O blow, my bully boys, blow. Soon may the Wellerman come. To bring us sugar and tea and rum. One day, when the tonguin' is done. We'll take our leave and go.",
			Availability: []src.Availability{
				{Day: "Monday", Start: "12:00", End: "13:00"},
				{Day: "Wednesday", Start: "12:00", End: "13:00"},
				{Day: "Wednesday", Start: "15:00", End: "16:00"},
				{Day: "Friday", Start: "12:00", End: "13:00"},
			},
		},
	}
	src.DB.Create(tutors)

	tutoring := []src.Tutoring{
		{Tutor: tutors[0], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[0]},
		{Tutor: tutors[1], Course: courses[1]},
		{Tutor: tutors[2], Course: courses[2]},
	}
	src.DB.Create(tutoring)
}
