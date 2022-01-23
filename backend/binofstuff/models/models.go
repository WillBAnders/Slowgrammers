package models

type Class struct {
	code  string  'json:"code"'
	name  string  'json:"name"'
}
/*
type Member struct {
	gorm.Model
	email     string
	name      string
	phone     string
	password  string
	galleons  float
}

type Slot struct {
	gorm.Model
	day        int
	month      int
	year       int
	startHour  int
	startMin   int
	endHour    int
	endMin     int
}

type Tutoring struct {
	gorm.Model
	id            string
	email         string
	classCode     string
	className     string
	price         float
	rating        int
	availability  []Slot
}
*/