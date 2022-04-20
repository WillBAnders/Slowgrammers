package src

import (
	"encoding/json"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase(dsn string) {
	//TODO: Error handling
	DB, _ = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	_ = DB.AutoMigrate(&User{}, &Course{}, &Tutor{}, &Availability{}, &Tutoring{})
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
	UserID       uint           `gorm:"primaryKey" json:"-"`
	User         User           `gorm:"foreignKey:UserID" json:"-"`
	Rating       float32        `gorm:"not null" json:"rating"`
	Bio          string         `gorm:"not null" json:"bio"`
	Availability []Availability `gorm:"foreignKey:TutorID;references:UserID" json:"availability"`
}

func (tutor Tutor) MarshalJSON() ([]byte, error) {
	if tutor.Availability == nil {
		tutor.Availability = make([]Availability, 0)
	}
	type Alias Tutor
	return json.Marshal(&struct {
		*User
		Alias
	}{
		User:  &tutor.User,
		Alias: Alias(tutor),
	})
}

type Availability struct {
	ID      uint   `gorm:"primaryKey" json:"-"`
	TutorID uint   `gorm:"not null" json:"-"`
	Day     string `gorm:"not null" json:"day"`
	Start   string `gorm:"not null" json:"start"`
	End     string `gorm:"not null" json:"end"`
}

type Tutoring struct {
	TutorID  uint   `gorm:"primaryKey" json:"-"`
	Tutor    Tutor  `gorm:"foreignKey:TutorID" json:"tutor"`
	CourseID uint   `gorm:"primaryKey" json:"-"`
	Course   Course `gorm:"foreignKey:CourseID" json:"course"`
}
