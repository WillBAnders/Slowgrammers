package main

import (
	//"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	//"gorm.io/driver/sqlite"
    //"github.com/jinzhu/gorm/dialects/sqlite"
	//"github.com/jinzhu/gorm"
    //_ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Class struct {
	gorm.Model
	code  string
	name  string
}

func main() {
	//db connection
	/*
	db, err := gorm.Open(sqlite.Open("developmentDB.db"), &gorm.Config{})
	if err != nil {
		panic("ERROR: Failed to connect database")
	} else {
		fmt.Println("INFO: Connected to database")
	}
	*/
	/*
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("ERROR: Failed to connect database")
	} else {
		fmt.Println("INFO: Connected to database")
	}
	defer db.Close() */
	/*
	db.AutoMigrate(&Class{})
	
	newTuple := Class{code: "XXX0000", name: "Somewhere over the rainbow"}
	db.Create(&newTuple)
	
	var classes []Class
	db.Find(classes)
	
	
	*/
	
	//db.AutoMigrate(&Class{})
	
	//channel := Class{code: "XXX0000", name: "Somewhere over the rainbow"}
	//db.Create(&channel)
	
	//var classes []Class
	//db.Find(&classes)
	//fmt.Println(classes)
	
	/*
	db.CreateTable(Class{"code", "name"})
	fmt.Println("INFO: Table created")
	trial := &Class{code: "XXX1111", name: "Hazy shade of winter"}
	db.Create(trial)
	fmt.Println("INFO: Tuple added")
	
	
	
	
	var class Class
	rows, err := db.Model(&Class{}).Rows()
	defer rows.Close()
	if err != nil {
        panic(err)
    }
	
	for rows.Next() {
        db.ScanRows(rows, &class)
        fmt.Println(class)
    }
	*/
	
	
	
	//db.Create(&Class{code: "XXX0000", name: "Somewhere over the rainbow"})
	
	//var class Class
	//var temp = db.Take(&class)
	
	//var classes []Class
	//db.Find(&classes)
	
	//fmt.Println(classes)
	
	
	
	//boilerplate
	
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run(":8080")
	
}
