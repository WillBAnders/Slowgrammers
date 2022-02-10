package src

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	//TODO: Error handling
	//TODO: Fix relative path use (relative from cmd/<cmd>)
	DB, _ = gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	_ = DB.AutoMigrate(&User{}, &Course{}, &Tutor{}, &Tutoring{})
}

//TODO: Merge with Tutor (depends on information stored)
type User struct {
	ID       uint   `gorm:"primaryKey" json:"-"`
	Username string `gorm:"unique,not null" json:"username"`
	Password string `gorm:"not null" json:"-"`
}

type Course struct {
	ID   uint   `gorm:"primaryKey" json:"-"`
	Code string `gorm:"unique,not null" json:"code"`
	Name string `gorm:"not null" json:"name"`
}

type Tutor struct {
	ID       uint   `gorm:"primaryKey" json:"-"`
	Username string `gorm:"unique,not null" json:"username"`
}

type Tutoring struct {
	TutorID  uint   `json:"-"`
	Tutor    Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	CourseID uint   `json:"-"`
	Course   Course `gorm:"foreignKey:CourseID" json:"course"`
}
