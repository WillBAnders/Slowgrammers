package main

import (
	"backend/src"
	"os"
)

func main() {
	//TODO: Error handling
	src.InitDatabase("database.db")
	src.InitRouter()

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8080"
	} else {
		port = os.Getenv("PORT")
	}
	_ = src.Router.Run(":" + port)
}
