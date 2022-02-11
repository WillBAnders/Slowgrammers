package src

import (
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRouterSuite(t *testing.T) {
	suite.Run(t, new(RouterSuite))
}

type RouterSuite struct {
	suite.Suite
}

func (suite *RouterSuite) SetupSuite() {
	InitRouter()
}

func manualSetupTest(test func()) func() {
	return func() {
		InitDatabase("file::memory:")
		test()
	}
}

func (suite *RouterSuite) TestGetCourses() {
	test := func(courses []Course, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(courses)
			w := request("GET", "/courses")
			suite.Equal(200, w.Code)
			suite.JSONEq(expected, w.Body.String())
		})
	}

	suite.Run("Empty", test(
		[]Course{},
		`{
			"courses": []
		}`,
	))

	suite.Run("Single", test(
		[]Course{
			{Code: "code", Name: "Name"},
		},
		`{
			"courses": [
				{"code": "code", "name": "Name"}
			]
		}`,
	))

	suite.Run("Multiple", test(
		[]Course{
			{Code: "1", Name: "First"},
			{Code: "2", Name: "Second"},
			{Code: "3", Name: "Third"},
		},
		`{
			"courses": [
				{"code": "1", "name": "First"},
				{"code": "2", "name": "Second"},
				{"code": "3", "name": "Third"}
			]
		}`,
	))

	suite.Run("Order", test(
		[]Course{
			{Code: "3", Name: "Third"},
			{Code: "2", Name: "Second"},
			{Code: "1", Name: "First"},
		},
		`{
			"courses": [
				{"code": "1", "name": "First"},
				{"code": "2", "name": "Second"},
				{"code": "3", "name": "Third"}
			]
		}`,
	))
}

func (suite *RouterSuite) TestGetCoursesCode() {
	//Fix ID to ensure multiple references use the same course
	course := Course{ID: 1, Code: "code", Name: "Name"}

	test := func(tutorings []Tutoring, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(&course)
			DB.Create(tutorings)
			w := request("GET", "/courses/"+course.Code)
			suite.Equal(200, w.Code)
			suite.JSONEq(expected, w.Body.String())
		})
	}

	suite.Run("Empty Tutors", test(
		[]Tutoring{},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": []
		}`,
	))

	suite.Run("Single Tutor", test(
		[]Tutoring{
			{Course: course, Tutor: Tutor{Username: "Username"}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"username": "Username"}
			]
		}`,
	))

	suite.Run("Multiple Tutors", test(
		[]Tutoring{
			{Course: course, Tutor: Tutor{Username: "Alice"}},
			{Course: course, Tutor: Tutor{Username: "Bob"}},
			{Course: course, Tutor: Tutor{Username: "Clair"}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"username": "Alice"},
				{"username": "Bob"},
				{"username": "Clair"}
			]
		}`,
	))

	suite.Run("Tutors Order", test(
		[]Tutoring{
			{Course: course, Tutor: Tutor{Username: "Clair"}},
			{Course: course, Tutor: Tutor{Username: "Bob"}},
			{Course: course, Tutor: Tutor{Username: "Alice"}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"username": "Alice"},
				{"username": "Bob"},
				{"username": "Clair"}
			]
		}`,
	))

	suite.Run("Undefined Code", manualSetupTest(func() {
		w := request("GET", "/courses/undefined")
		suite.Equal(404, w.Code)
	}))
}

func (suite *RouterSuite) TestGetTutors() {
	test := func(tutors []Tutor, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(tutors)
			w := request("GET", "/tutors")
			suite.Equal(200, w.Code)
			suite.JSONEq(expected, w.Body.String())
		})
	}

	suite.Run("Empty", test(
		[]Tutor{},
		`{
			"tutors": []
		}`,
	))

	suite.Run("Single", test(
		[]Tutor{
			{Username: "Username"},
		},
		`{
			"tutors": [
				{"username": "Username"}
			]
		}`,
	))

	suite.Run("Multiple", test(
		[]Tutor{
			{Username: "Alice"},
			{Username: "Bob"},
			{Username: "Clair"},
		},
		`{
			"tutors": [
				{"username": "Alice"},
				{"username": "Bob"},
				{"username": "Clair"}
			]
		}`,
	))

	suite.Run("Order", test(
		[]Tutor{
			{Username: "Clair"},
			{Username: "Bob"},
			{Username: "Alice"},
		},
		`{
			"tutors": [
				{"username": "Alice"},
				{"username": "Bob"},
				{"username": "Clair"}
			]
		}`,
	))
}

func (suite *RouterSuite) TestGetTutorsUsername() {
	//Fix ID to ensure multiple references use the same tutor
	tutor := Tutor{ID: 1, Username: "Username"}

	test := func(tutorings []Tutoring, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(&tutor)
			DB.Create(tutorings)
			w := request("GET", "/tutors/"+tutor.Username)
			suite.Equal(200, w.Code)
			suite.JSONEq(expected, w.Body.String())
		})
	}

	suite.Run("Empty Courses", test(
		[]Tutoring{},
		`{
			"tutor": {"username": "Username"},
			"courses": []
		}`,
	))

	suite.Run("Single Tutor", test(
		[]Tutoring{
			{Course: Course{Code: "code", Name: "Name"}, Tutor: tutor},
		},
		`{
			"tutor": {"username": "Username"},
			"courses": [
				{"code": "code", "name": "Name"}
			]
		}`,
	))

	suite.Run("Multiple Tutors", test(
		[]Tutoring{
			{Course: Course{Code: "1", Name: "First"}, Tutor: tutor},
			{Course: Course{Code: "2", Name: "Second"}, Tutor: tutor},
			{Course: Course{Code: "3", Name: "Third"}, Tutor: tutor},
		},
		`{
			"tutor": {"username": "Username"},
			"courses": [
				{"code": "1", "name": "First"},
				{"code": "2", "name": "Second"},
				{"code": "3", "name": "Third"}
			]
		}`,
	))

	suite.Run("Courses Order", test(
		[]Tutoring{
			{Course: Course{Code: "3", Name: "Third"}, Tutor: tutor},
			{Course: Course{Code: "2", Name: "Second"}, Tutor: tutor},
			{Course: Course{Code: "1", Name: "First"}, Tutor: tutor},
		},
		`{
			"tutor": {"username": "Username"},
			"courses": [
				{"code": "1", "name": "First"},
				{"code": "2", "name": "Second"},
				{"code": "3", "name": "Third"}
			]
		}`,
	))

	suite.Run("Undefined Username", manualSetupTest(func() {
		w := request("GET", "/tutors/undefined")
		suite.Equal(404, w.Code)
	}))
}

func request(method string, path string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(method, path, nil)
	Router.ServeHTTP(w, req)
	return w
}
