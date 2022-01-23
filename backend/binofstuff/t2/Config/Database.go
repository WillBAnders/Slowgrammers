package Config

import (
	"fmt"
	"github.com/jinzhu/gorm"
)

var DB *gorm.DB

type Class struct {
	code  string
	name  string
}

func BuildClass() *Class {
	class := Class{
		code: "ZZZ",
		name: "Meal mush and goat's milk",
	}
	return &class
}

func DbURL(class *Class) string {
	return fmt.Sprintf(
		"%s:%s",
		class.code,
		class.name,
	)
}