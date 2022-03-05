package src

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase(dsn string) {
	//TODO: Error handling
	DB, _ = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	_ = DB.AutoMigrate(&User{}, &Course{}, &Tutor{}, &Tutoring{})
}

type User struct {
	ID        uint   `gorm:"primaryKey" json:"-"`
	Username  string `gorm:"unique,not null" json:"username"`
	Password  string `gorm:"not null" json:"-"`
	FirstName string `gorm:"not null" json:"firstname"`
	LastName  string `gorm:"not null" json:"lastname"`
	Email     string `gorm:"not null" json:"email"`
	Phone     string `gorm:"not null" json:"phone"`
}

type Course struct {
	ID   uint   `gorm:"primaryKey" json:"-"`
	Code string `gorm:"unique,not null" json:"code"`
	Name string `gorm:"not null" json:"name"`
}

type Tutor struct {
	UserID       uint    `gorm:"primaryKey" json:"-"`
	User         User    `gorm:"foreignKey:UserID" json:"user"`
	Rating       float32 `gorm:"not null" json:"rating"`
	Bio          string  `gorm:"not null" json:"bio"`
	Availability string  `gorm:"not null" json:"availability"`
	//TODO: Courses via many2many join table?
}

/*type Availability struct {
	//TODO: Add to Tutor (Gorm issues)
    //TODO: Include times
	TutorID uint   `gorm:"primaryKey" json:"-"`
	Day     string `gorm:"primaryKey, not null" json:"day"`
}*/

type Tutoring struct {
	TutorID  uint   `gorm:"primaryKey" json:"-"`
	Tutor    Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	CourseID uint   `gorm:"primaryKey" json:"-"`
	Course   Course `gorm:"foreignKey:CourseID" json:"course"`
}
