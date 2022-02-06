package main

import (
	"backend/src"
)

func main() {
	//TODO: Error handling
	src.InitDatabase()
	src.InitRouter()
	_ = src.Router.Run(":8080")
}
