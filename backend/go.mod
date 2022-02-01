module backend

go 1.18

require github.com/gin-gonic/gin v1.7.7

require (
	github.com/mattn/go-sqlite3 v1.14.10 // indirect
	models v1.0.0
)

replace models v1.0.0 => ./models
