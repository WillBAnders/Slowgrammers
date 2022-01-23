package main

import (
	"github.com/gin-gonic/gin"
	"database/sql"
    "fmt"
    _ "github.com/mattn/go-sqlite3"
)

func getClasses(){
	db, _ := sql.Open("sqlite3", "./data.db")
	rows, _ := db.Query("SELECT code, name FROM Class")
    var code string
    var name string
    for rows.Next() {
        rows.Scan(&code, &name)
        fmt.Println(code + " " + name)
    }
}

func main() {
	r := gin.Default()
	
	//testing
	getClasses()
	
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run(":8080")
}