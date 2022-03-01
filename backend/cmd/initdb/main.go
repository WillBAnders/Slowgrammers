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
		{Username: "Alice", Rating: 5.0, Bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
		{Username: "Bob", Rating: 4.5, Bio: "Once upon a midnight dreary, while I pondered, weak and weary, Over many a quaint and curious volume of forgotten lore—While I nodded, nearly napping, suddenly there came a tapping, As of some one gently rapping, rapping at my chamber door. `Tis some visitor,` I muttered, `tapping at my chamber door—Only this and nothing more.`"},
		{Username: "Clair", Rating: 2.0, Bio: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way--in short, the period was so far like the present period that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only."},
		{Username: "David", Rating: 0.0, Bio: "There once was a ship that put to sea. The name of the ship was the Billy of Tea. The winds blew up, her bow dipped down. O blow, my bully boys, blow. Soon may the Wellerman come. To bring us sugar and tea and rum. One day, when the tonguin' is done. We'll take our leave and go."},
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
		{Username: "Eve", FirstName: "Evangeline", LastName: "Mae", Email: "emae@gmail.com", Phone: "(123) 456-7890"},
		{Username: "Fred", FirstName: "Fred", LastName: "Flinstone", Email: "freddyflint@aol.com", Phone: "(234) 567-8901"},
		{Username: "Greta", FirstName: "Greta", LastName: "Glade", Email: "gg@hotmail.com", Phone: "(345) 678-9012"},
		{Username: "Henry", FirstName: "Henry", LastName: "Hue", Email: "henrytheeight@ufl.edu", Phone: "(456) 789-0123"},
		{Username: "Alice", FirstName: "Alice", LastName: "Smith", Email: "alicemsmith@gmail.com", Phone: "(567) 890-1234"},
		{Username: "Bob", FirstName: "Bob", LastName: "Crachett", Email: "bobbyc@gmail.com", Phone: "(678) 901-2345"},
		{Username: "Clair", FirstName: "Clair", LastName: "Carson", Email: "claircarson@gmail.com", Phone: "(789) 012-3456"},
		{Username: "David", FirstName: "David", LastName: "Davidson", Email: "davidsquared@outlook.com", Phone: "(890) 123-4567"},
	}
	src.DB.Create(users)
}
