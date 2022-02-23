package src

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase(dsn string) {
	//TODO: Error handling
	//TODO: Fix relative path use (relative from cmd/<cmd>)
	DB, _ = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	_ = DB.AutoMigrate(&Course{}, &Tutor{}, &Availability{}, &Tutoring{}, &User{})
}

type Course struct {
	ID   uint   `gorm:"primaryKey" json:"-"`
	Code string `gorm:"unique,not null" json:"code"`
	Name string `gorm:"not null" json:"name"`
}

type Tutor struct {
	ID        uint    `gorm:"primaryKey" json:"-"`
	Username  string  `gorm:"unique,not null" json:"username"`
	Rating    float32 `gorm:"not null" json:"rating"`
	FirstName string  `gorm:"not null" json:"firstname"`
	LastName  string  `gorm:"not null" json:"lastname"`
}

type Availability struct {
	TutorID uint   `json:"-"`
	Tutor   Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	Day     string `gorm:"not null" json:"day"`
}

type Tutoring struct {
	TutorID  uint   `json:"-"`
	Tutor    Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	CourseID uint   `json:"-"`
	Course   Course `gorm:"foreignKey:CourseID" json:"course"`
}

type User struct {
	ID        uint   `gorm:"primaryKey" json:"-"`
	Username  string `gorm:"unique,not null" json:"username"`
	FirstName string `gorm:"unique,not null" json:"firstname"`
	LastName  string `gorm:"unique,not null" json:"lastname"`
	//TODO: Add other attributes
}
