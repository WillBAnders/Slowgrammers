package src

import (
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"net/http/httptest"
	"strings"
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
			w := GET("/courses")
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
			w := GET("/courses/" + course.Code)
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
			{Course: course, Tutor: Tutor{User: User{Username: "Username"}}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"user": `+stringify(User{Username: "Username"})+`, "rating": 0.0, "bio": "", "availability": []}
			]
		}`,
	))

	suite.Run("Multiple Tutors", test(
		[]Tutoring{
			{Course: course, Tutor: Tutor{User: User{Username: "Alice"}}},
			{Course: course, Tutor: Tutor{User: User{Username: "Bob"}}},
			{Course: course, Tutor: Tutor{User: User{Username: "Clair"}}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"user": `+stringify(User{Username: "Alice"})+`, "rating": 0.0, "bio": "", "availability": []},
				{"user": `+stringify(User{Username: "Bob"})+`, "rating": 0.0, "bio": "", "availability": []},
				{"user": `+stringify(User{Username: "Clair"})+`, "rating": 0.0, "bio": "", "availability": []}
			]
		}`,
	))

	suite.Run("Tutors Order", test(
		[]Tutoring{
			{Course: course, Tutor: Tutor{User: User{Username: "Clair"}}},
			{Course: course, Tutor: Tutor{User: User{Username: "Bob"}}},
			{Course: course, Tutor: Tutor{User: User{Username: "Alice"}}},
		},
		`{
			"course": {"code": "code", "name": "Name"},
			"tutors": [
				{"user": `+stringify(User{Username: "Alice"})+`, "rating": 0.0, "bio": "", "availability": []},
				{"user": `+stringify(User{Username: "Bob"})+`, "rating": 0.0, "bio": "", "availability": []},
				{"user": `+stringify(User{Username: "Clair"})+`, "rating": 0.0, "bio": "", "availability": []}
			]
		}`,
	))

	suite.Run("Undefined Code", manualSetupTest(func() {
		w := GET("/courses/undefined")
		suite.Equal(404, w.Code)
	}))
}

func (suite *RouterSuite) TestGetTutors() {
	test := func(tutors []Tutor, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(tutors)
			w := GET("/tutors")
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
			{User: User{Username: "Username"}},
		},
		`{
			"tutors": [
				`+stringify(Tutor{User: User{Username: "Username"}})+`
			]
		}`,
	))

	suite.Run("Multiple", test(
		[]Tutor{
			{User: User{Username: "Alice"}},
			{User: User{Username: "Bob"}},
			{User: User{Username: "Clair"}},
		},
		`{
			"tutors": [
				`+stringify(Tutor{User: User{Username: "Alice"}})+`,
				`+stringify(Tutor{User: User{Username: "Bob"}})+`,
				`+stringify(Tutor{User: User{Username: "Clair"}})+`
			]
		}`,
	))

	suite.Run("Order", test(
		[]Tutor{
			{User: User{Username: "Clair"}},
			{User: User{Username: "Bob"}},
			{User: User{Username: "Alice"}},
		},
		`{
			"tutors": [
				`+stringify(Tutor{User: User{Username: "Alice"}})+`,
				`+stringify(Tutor{User: User{Username: "Bob"}})+`,
				`+stringify(Tutor{User: User{Username: "Clair"}})+`
			]
		}`,
	))
}

func (suite *RouterSuite) TestGetTutorsUsername() {
	//Fix ID to ensure multiple references use the same tutor
	tutor := Tutor{User: User{ID: 1, Username: "Username"}}

	test := func(tutorings []Tutoring, expected string) func() {
		return manualSetupTest(func() {
			DB.Create(&tutor)
			DB.Create(tutorings)
			w := GET("/tutors/" + tutor.User.Username)
			suite.Equal(200, w.Code)
			suite.JSONEq(expected, w.Body.String())
		})
	}

	suite.Run("Empty Courses", test(
		[]Tutoring{},
		`{
			"tutor": {
				"user": `+stringify(tutor.User)+`,
				"rating": `+stringify(tutor.Rating)+`,
				"bio": `+stringify(tutor.Bio)+`,
				"availability": `+stringify(strings.FieldsFunc(tutor.Availability, func(r rune) bool { return r == ',' }))+`
            },
			"courses": []
		}`,
	))

	suite.Run("Single Course", test(
		[]Tutoring{
			{Course: Course{Code: "code", Name: "Name"}, Tutor: tutor},
		},
		`{
			"tutor": {
				"user": `+stringify(tutor.User)+`,
				"rating": `+stringify(tutor.Rating)+`,
				"bio": `+stringify(tutor.Bio)+`,
				"availability": `+stringify(strings.FieldsFunc(tutor.Availability, func(r rune) bool { return r == ',' }))+`
            },
			"courses": [
				{"code": "code", "name": "Name"}
			]
		}`,
	))

	suite.Run("Multiple Courses", test(
		[]Tutoring{
			{Course: Course{Code: "1", Name: "First"}, Tutor: tutor},
			{Course: Course{Code: "2", Name: "Second"}, Tutor: tutor},
			{Course: Course{Code: "3", Name: "Third"}, Tutor: tutor},
		},
		`{
			"tutor": {
				"user": `+stringify(tutor.User)+`,
				"rating": `+stringify(tutor.Rating)+`,
				"bio": `+stringify(tutor.Bio)+`,
				"availability": `+stringify(strings.FieldsFunc(tutor.Availability, func(r rune) bool { return r == ',' }))+`
            },
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
			"tutor": {
				"user": `+stringify(tutor.User)+`,
				"rating": `+stringify(tutor.Rating)+`,
				"bio": `+stringify(tutor.Bio)+`,
				"availability": `+stringify(strings.FieldsFunc(tutor.Availability, func(r rune) bool { return r == ',' }))+`
            },
			"courses": [
				{"code": "1", "name": "First"},
				{"code": "2", "name": "Second"},
				{"code": "3", "name": "Third"}
			]
		}`,
	))

	suite.Run("Undefined Username", manualSetupTest(func() {
		w := GET("/tutors/undefined")
		suite.Equal(404, w.Code)
	}))
}

func (suite *RouterSuite) TestSignup() {
	test := func(username string, password string) *httptest.ResponseRecorder {
		return POST("/signup", gin.H{
			"username": username,
			"password": password,
		})
	}

	suite.Run("Success", manualSetupTest(func() {
		w := test("Username", "Password")
		suite.Equal(200, w.Code)

		claims, _ := ParseJWT(w.Result().Cookies()[0].Value)
		suite.Equal("Username", claims.Username)
	}))

	suite.Run("Invalid Request (Missing Field)", manualSetupTest(func() {
		w := POST("/signup", gin.H{
			"username": "Username",
		})
		suite.Equal(400, w.Code)
	}))

	/*
		//TODO: Error on unknown fields
		suite.Run("Invalid Request (Unknown Field)", manualSetupTest(func() {
			w := POST("/signup", gin.H{
				"username": "Username",
				"password": "Password",
				"unknown":  "Unknown",
			})
			suite.Equal(400, w.Code)
		}))
	*/

	suite.Run("Duplicate Username", manualSetupTest(func() {
		hash, _ := bcrypt.GenerateFromPassword([]byte("Password"), bcrypt.DefaultCost)
		DB.Create(&User{Username: "Username", Password: string(hash)})

		w := test("Username", "Password")
		suite.Equal(401, w.Code)
	}))
}

func (suite *RouterSuite) TestSignin() {
	test := func(username string, password string) *httptest.ResponseRecorder {
		hash, _ := bcrypt.GenerateFromPassword([]byte("Password"), bcrypt.DefaultCost)
		DB.Create(&User{Username: "Username", Password: string(hash)})

		return POST("/signin", gin.H{
			"username": username,
			"password": password,
		})
	}

	suite.Run("Success", manualSetupTest(func() {
		w := test("Username", "Password")
		suite.Equal(200, w.Code)

		cookie := w.Result().Cookies()[0]
		suite.Equal("jwt", cookie.Name)
		claims, _ := ParseJWT(cookie.Value)
		suite.Equal("Username", claims.Username)
	}))

	suite.Run("Invalid Request (Missing Field)", manualSetupTest(func() {
		w := POST("/signin", gin.H{
			"username": "Username",
		})
		suite.Equal(400, w.Code)
	}))

	/*
		//TODO: Error on unknown fields
		suite.Run("Invalid Request (Unknown Field)", manualSetupTest(func() {
			w := POST("/signin", gin.H{
				"username": "Username",
				"password": "Password",
				"unknown":  "Unknown",
			})
			suite.Equal(400, w.Code)
		}))
	*/

	suite.Run("Unknown Username", manualSetupTest(func() {
		w := test("Unknown", "Password")
		suite.Equal(401, w.Code)
	}))

	suite.Run("Invalid Password", manualSetupTest(func() {
		w := test("Username", "Invalid")
		suite.Equal(401, w.Code)
	}))
}

func (suite *RouterSuite) TestSignout() {
	suite.Run("Success", manualSetupTest(func() {
		hash, _ := bcrypt.GenerateFromPassword([]byte("Password"), bcrypt.DefaultCost)
		DB.Create(&User{Username: "Username", Password: string(hash)})

		w := POST("/signin", gin.H{
			"username": "Username",
			"password": "Password",
		})
		suite.Equal(200, w.Code)

		w = POST("/signout", gin.H{})
		suite.Equal(200, w.Code)
		cookie := w.Result().Cookies()[0]
		suite.Equal("jwt", cookie.Name)
		suite.Equal("", cookie.Value)
	}))

	suite.Run("Unauthenticated", manualSetupTest(func() {
		w := POST("/signout", gin.H{})
		suite.Equal(200, w.Code)
	}))
}

func (suite *RouterSuite) TestProfile() {
	suite.Run("Success", manualSetupTest(func() {
		hash, _ := bcrypt.GenerateFromPassword([]byte("Password"), bcrypt.DefaultCost)
		DB.Create(&User{Username: "Username", Password: string(hash)})

		w := POST("/signin", gin.H{
			"username": "Username",
			"password": "Password",
		})
		suite.Equal(200, w.Code)
		cookies := w.Result().Cookies()
		suite.Equal("jwt", cookies[0].Name)

		w = GET("/profile", cookies...)
		suite.Equal(200, w.Code)
		suite.JSONEq(`{
			"user": `+stringify(User{Username: "Username"})+`
		}`, w.Body.String())
		
		w = PATCH("/profile", gin.H{"firstname": "Elk","lastname": "Cloner",}, cookies...)
		suite.Equal(200, w.Code)
		
		w = PATCH("/profile", gin.H{"email": "coolbeans@aol.com"}, cookies...)
		suite.Equal(200, w.Code)
		
		w = PATCH("/profile", gin.H{"phone": "1234567890"}, cookies...)
		suite.Equal(200, w.Code)
	}))

	suite.Run("Unauthenticated", manualSetupTest(func() {
		w := GET("/profile")
		suite.Equal(401, w.Code)
		
		w = PATCH("/profile", gin.H{"firstname": "Elk","lastname": "Cloner",})
		suite.Equal(401, w.Code)
	}))
}

func GET(path string, cookies ...*http.Cookie) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", path, nil)
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}
	Router.ServeHTTP(w, req)
	return w
}

func POST(path string, body gin.H) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	data, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", path, bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")
	Router.ServeHTTP(w, req)
	return w
}

func PATCH(path string, body gin.H, cookies ...*http.Cookie) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	data, _ := json.Marshal(body)
	req, _ := http.NewRequest("PATCH", path, bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}
	Router.ServeHTTP(w, req)
	return w
}

func stringify(data any) string {
	result, _ := json.Marshal(data)
	return string(result)
}
