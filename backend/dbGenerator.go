/*
This file is to set up or regenerate the database. It autopopulates some fictional data for testing along with entering the real, default data. In the case that the database is deleted because of testing, this script will recreate it. Follow the menu to customize what is included in the database.
*/

package main

import (
	"fmt"
	"database/sql"
    _ "github.com/mattn/go-sqlite3"
)

func main() {
	fmt.Println("--------------------------------------------------------")
	fmt.Println("| [0] Deployment-Ready DB                              |")
	fmt.Println("|       Class-filled; Member-empty; Tutoring-empty     |")
	fmt.Println("| [1] Testing DB                                       |")
	fmt.Println("|       Class-filled; Member-randGen; Tutoring-randGen |")
	fmt.Println("--------------------------------------------------------")
	fmt.Print("Select a menu option: ")
	var option int
	fmt.Scanf("%d", &option)
	if option != 0 && option != 1 {
		fmt.Println("Invalid Option")
		return
	}
	
	fmt.Println("Generating DB...")
	database, _ := sql.Open("sqlite3", "./data.db")
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS Class(code TEXT, name TEXT)")
    statement.Exec()
	statement, _ = database.Prepare("INSERT INTO Class (code, name) VALUES (?, ?)")
    statement.Exec("COP3502C", "Programming Fundamentals 1")
	statement.Exec("COP3503C", "Programming Fundamentals 2")
	statement.Exec("COP3530", "Data Structures and Algorithms")
	statement.Exec("COT3100", "Applications of Discrete Structures")
	statement.Exec("CDA3101", "Introduction to Computer Organization")
	statement.Exec("CEN3031", "Introduction to Software Engineering")
	statement.Exec("CIS4301", "Information and Database Systems")
	statement.Exec("CNT4007", "Computer Network Fundamentals")
	statement.Exec("COP4020", "Programming Language Concepts")
	statement.Exec("COP4533", "Algorithm Abstraction and Design")
	statement.Exec("COP4600", "Operating Systems")
	
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS Member(name TEXT, email TEXT, phone TEXT, password TEXT, galleons INTEGER)")
    statement.Exec()
	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS Tutoring(id INTEGER, email TEXT, classCode TEXT, className TEXT, price FLOAT, rating INTEGER, availability TEXT)")
    statement.Exec()
	
	if option == 1 {
		statement, _ = database.Prepare("INSERT INTO Member (name, email, phone, password, galleons) VALUES (?, ?, ?, ?, ?)")
		statement.Exec("Dorothy Gale", "overtherainbow@gmail.com", "1234567890", "password", 0)
		statement.Exec("Albert Gator", "gogators@gmail.com", "2345678901", "password", 0)
		statement.Exec("Diego de le Vega", "notzorro@hotmail.com", "3456789012", "password", 0)
		statement.Exec("Elizabeth Bennet", "pollutingtheshadesofpemberly@outlook.com", "4567890123", "password", 0)
		statement.Exec("Peter Parker", "spidey@gmail.com", "5678901234", "password", 0)
		statement.Exec("Ebenezer Scrooge", "bahhumbug@gmail.com", "6789012345", "password", 0)
		statement.Exec("Harry Potter", "harryfreakingpotter@gmail.com", "7890123456", "password", 100)
		
		statement, _ = database.Prepare("INSERT INTO Tutoring (id, email, classCode, className, price, rating, availability) VALUES (?, ?, ?, ?, ?, ?, ?)")
		statement.Exec(1, "bahhumbug@gmail.com", "COP3502C", "Programming Fundamentals 1", 10.00, 5, "N/A")
		statement.Exec(2, "spidey@gmail.com", "COP4600", "Operating Systems", 20.00, 4, "N/A")
		statement.Exec(3, "bahhumbug@gmail.com", "COP3530", "Data Structures and Algorithms", 30.00, 3, "N/A")
		statement.Exec(4, "notzorro@hotmail.com", "COP3502C", "Programming Fundamentals 1", 15.00, 5, "N/A")
		statement.Exec(5, "bahhumbug@gmail.com", "COT3100", "Applications of Discrete Structures", 10.00, 3, "N/A")
		statement.Exec(6, "gogators@gmail.com", "COP3503C", "Programming Fundamentals 2", 20.00, 2, "N/A")
		statement.Exec(7, "spidey@gmail.com", "CNT4007", "Computer Network Fundamentals", 10.00, 1, "N/A")
	} 
	
	fmt.Println("Generation completed")
}