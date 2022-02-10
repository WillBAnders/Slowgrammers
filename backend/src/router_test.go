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

func request(method string, path string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(method, path, nil)
	Router.ServeHTTP(w, req)
	return w
}
