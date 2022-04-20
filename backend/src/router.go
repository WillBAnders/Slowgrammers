package src

import (
	"regexp"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var Router *gin.Engine

func InitRouter() {
	Router = gin.Default()
	Router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true}))
	Router.GET("/courses", getCourses)
	Router.GET("/courses/:code", getCoursesCode)
	Router.GET("/tutors", getTutors)
	Router.POST("/tutors", postTutors)
	Router.GET("/tutors/:username", getTutorsUsername)
	Router.POST("/signup", postSignup)
	Router.POST("/signin", postSignin)
	Router.POST("/signout", postSignout)
	Router.GET("/profile", getProfile)
	Router.PATCH("/profile", patchProfile)
}

// Handler for /courses. Returns all courses ordered by code.
//
// Response Schema: {
//   courses: []Course {
//     code: String
//     name: String
//   }
// }
func getCourses(c *gin.Context) {
	//TODO: Pagination support
	var courses []Course
	DB.Order("code").Find(&courses)

	c.JSON(200, gin.H{
		"courses": courses,
	})
}

// Handler for /courses/:code. Returns the course identified by :code along
// with all tutors ordered by username. If there is no authenticated user, all
// tutor's contact information is hidden. Errors if:
//
//  - The course :code does not exist (404)
//  - A server issue prevents parsing the JWT (500)
//
// Response Schema: {
//   course: Course {
//     code: String
//     name: String
//   }
//   tutors: []Tutor {
//     username: String
//     firstname: String
//     lastname: String
//     email: String ("" if unauthenticated)
//     phone: String ("" if unauthenticated)
//     rating: Float
//     bio: String
//     availability: []String
//   }
// }
// Error Schema: {
//   error: String
// }
func getCoursesCode(c *gin.Context) {
	code := c.Params.ByName("code")

	var courses []Course
	DB.Limit(1).Find(&courses, "code = ?", code)
	if len(courses) != 1 {
		c.JSON(404, gin.H{
			"error": "Course " + code + " not found.",
		})
		return
	}

	//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
	var tutorings []Tutoring
	DB.Joins("Tutor").Joins("LEFT JOIN users User ON id = Tutor__user_id").Preload("Tutor.Availability").Preload("Tutor.User").Order("User.username").Find(&tutorings, "course_id = ?", courses[0].ID)
	tutors := make([]Tutor, len(tutorings))
	for i, tutoring := range tutorings {
		//TODO: Limit the amount of data being returned
		tutors[i] = tutoring.Tutor
	}

	if token, err := c.Cookie("jwt"); err == nil {
		if _, err := ParseJWT(token); err != nil {
			c.JSON(500, gin.H{
				"error": "Unable to parse JWT: " + err.Error() + ".",
			})
			return
		}
	} else {
		for i := range tutors {
			tutors[i].User.Email = ""
			tutors[i].User.Phone = ""
		}
	}

	c.JSON(200, gin.H{
		"course": courses[0],
		"tutors": tutors,
	})
}

// Handler for /tutors. Returns all tutors ordered by username.
//
// Response Schema: {
//   tutors: []Tutor {
//     username: String
//   }
// }
func getTutors(c *gin.Context) {
	//TODO: Pagination support
	var tutors []Tutor
	DB.Joins("User").Order("User__username").Find(&tutors)

	c.JSON(200, gin.H{
		"tutors": tutors,
	})
}

// Handler for POST /tutors. Registers the authenticated user as a tutor.
// Returns an empty json if successful. Errors if:
//
//  - There is no authenticated user (401)
//  - A server issue prevents parsing the JWT (500)
//  - The user does not exist in the database (500)
//  - The user is already a tutor (409)
//
// Response Schema: {}
// Error Schema: {
//   error: String
// }
func postTutors(c *gin.Context) {
	token, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(401, gin.H{
			"error": "Requires an authenticated user.",
		})
		return
	}

	claims, err := ParseJWT(token)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to parse JWT: " + err.Error() + ".",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", claims.Username)
	if len(users) != 1 {
		c.JSON(500, gin.H{
			"error": "User " + claims.Username + " is authenticated but does not exist in the database.",
		})
		return
	}

	var tutors []Tutor
	DB.Limit(1).Find(&tutors, "user_id = ?", users[0].ID)
	if len(tutors) != 0 {
		c.JSON(409, gin.H{
			"error": "User " + claims.Username + " is already a tutor.",
		})
		return
	}

	DB.Create(&Tutor{UserID: users[0].ID})

	c.JSON(200, gin.H{})
}

// Handler for /tutors/:username. Returns the tutor identified by :username
// along with all courses tutored ordered by code. If there is no authenticated
// user, the tutor's contact information is hidden. Errors if:
//
//  - The tutor :username does not exist (404)
//  - A server issue prevents parsing the JWT (500)
//
// Response Schema: {
//   tutor: Tutor {
//     username: String
//     firstname: String
//     lastname: String
//     email: String ("" if unauthenticated)
//     phone: String ("" if unauthenticated)
//     rating: Float
//     bio: String
//     availability: []String
//   }
//   courses: []Course {
//     code: String
//     name: String
//   }
// }
// Error Schema: {
//   error: String
// }
func getTutorsUsername(c *gin.Context) {
	username := c.Params.ByName("username")

	var tutors []Tutor
	DB.Limit(1).Joins("User").Preload("Availability").Find(&tutors, "User__username = ?", username)
	if len(tutors) != 1 {
		c.JSON(404, gin.H{
			"error": "Tutor " + username + " not found.",
		})
		return
	}

	//TODO: Native Gorm handling with Pluck (Preload/Join extract?)
	var tutorings []Tutoring
	DB.Joins("Course").Order("Course__code").Find(&tutorings, "tutor_id = ?", tutors[0].UserID)
	//TODO: Error here with empty tutorings?
	courses := make([]Course, len(tutorings))
	for i, tutoring := range tutorings {
		courses[i] = tutoring.Course
	}

	if token, err := c.Cookie("jwt"); err == nil {
		if _, err := ParseJWT(token); err != nil {
			c.JSON(500, gin.H{
				"error": "Unable to parse JWT: " + err.Error() + ".",
			})
			return
		}
	} else {
		tutors[0].User.Email = ""
		tutors[0].User.Phone = ""
	}

	c.JSON(200, gin.H{
		"tutor":   tutors[0],
		"courses": courses,
	})
}

type AuthBody struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Handler for /signup. Takes a username and password and creates a new user
// account. Sets a jwt session to authenticate the user. Returns an empty
// object. Errors if:
//
//  - The body has missing/unknown fields (400)
//  - The username/password is invalid (400)
//  - The username already exists (401)
//  - A server issue prevents creating a JWT (500)
//     - The user is still successfully created
//
// Body Schema: {
//   username: String
//   password: String
// }
// Response Schema: {}
// Error Schema: {
//   error: String
// }
func postSignup(c *gin.Context) {
	//TODO: Error on unknown fields
	var body AuthBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request: " + err.Error() + ".",
		})
		return
	}

	if !regexp.MustCompile("[A-Za-z][A-Za-z0-9_\\-.]{0,71}").MatchString(body.Username) {
		c.JSON(400, gin.H{
			"error": "Username must start with a letter, can only contain alphanumeric characters and '_', '-', or '.', and cannot exceed 72 characters.",
		})
		return
	}

	if len(body.Password) < 8 || len(body.Password) > 72 {
		c.JSON(400, gin.H{
			"error": "Password must contain 8-72 characters.",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", body.Username)
	if len(users) != 0 {
		c.JSON(401, gin.H{
			"error": "User " + body.Username + " already exists.",
		})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	DB.Create(&User{Username: body.Username, Password: string(hash)})

	token, err := CreateJWT(body.Username)
	if err != nil {
		//TODO: Use status 207 to indicate the account was successfully created?
		c.JSON(500, gin.H{
			"error": "Unable to create JWT: " + err.Error() + ".",
		})
		return
	}
	c.SetCookie("jwt", token, int(24*time.Hour.Seconds()), "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /signin. Takes a username and password and logs in an existing
// user account. Sets a jwt session to authenticate the user. Returns an empty
// object. Errors if:
//
//  - The body has missing/unknown fields (400)
//  - The username does not exist (401)
//  - The password is invalid (401)
//  - A server issue prevents creating a JWT (500)
//
// Body Schema: {
//   username: String
//   password: String
// }
// Response Schema: {}
// Error Schema: {
//   error: String
// }
func postSignin(c *gin.Context) {
	//TODO: Error on unknown fields
	var body AuthBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request: " + err.Error() + ".",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", body.Username)
	if len(users) != 1 {
		c.JSON(401, gin.H{
			"error": "User " + body.Username + " not found.",
		})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(users[0].Password), []byte(body.Password)) != nil {
		c.JSON(401, gin.H{
			"error": "Invalid password.",
		})
	}

	token, err := CreateJWT(body.Username)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to create JWT: " + err.Error() + ".",
		})
		return
	}
	c.SetCookie("jwt", token, int(24*time.Hour.Seconds()), "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /signout. Signs out the user if currently authenticated. Returns
// an empty object.
//
// Response Schema: {}
func postSignout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "", "", true, true)

	c.JSON(200, gin.H{})
}

// Handler for /profile. Returns the user profile for the authenticated user.
// Errors if:
//
//  - There is no authenticated user (401)
//  - A server issue prevents parsing the JWT (500)
//  - The user does not exist in the database (500)
//
// Response Schema: {
//   profile: User | Tutor {
//     username: String
//     firstname: String
//     lastname: String
//     email: String
//     phone: String
//     rating?: Float
//     bio?: String
//     availability?: []String
//   }
// }
// Error Schema: {
//   error: String
// }
func getProfile(c *gin.Context) {
	token, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(401, gin.H{
			"error": "Requires an authenticated user.",
		})
		return
	}

	claims, err := ParseJWT(token)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to parse JWT: " + err.Error() + ".",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", claims.Username)
	if len(users) != 1 {
		c.JSON(500, gin.H{
			"error": "User " + claims.Username + " is authenticated but does not exist in the database.",
		})
		return
	}

	var tutors []Tutor
	DB.Limit(1).Preload("Availability").Find(&tutors, "user_id = ?", users[0].ID)
	if len(tutors) != 1 {
		c.JSON(200, gin.H{
			"profile": users[0],
		})
		return
	}
	tutors[0].User = users[0]

	c.JSON(200, gin.H{
		"profile": tutors[0],
	})
}

type PatchProfileBody struct {
	FirstName    *string `json:"firstname"`
	LastName     *string `json:"lastname"`
	Email        *string `json:"email"`
	Phone        *string `json:"phone"`
	Bio          *string `json:"bio"`
	Availability *[]struct {
		Day       string `json:"day" binding:"required"`
		StartTime string `json:"startTime" binding:"required"`
		EndTime   string `json:"endTime" binding:"required"`
	} `json:"availability"`
	Tutoring *[]struct {
		Code   string `json:"code" binding:"required"`
		Action bool   `json:"action" binding:"required"`
	} `json:"tutoring"`
}

// Handler for PATCH /profile. Takes any number of profile fields and updates
// the profile of the authenticated user. Returns an empty object. Errors if:
//
//  - The request body is invalid (400)
//  - There is no authenticated user (401)
//  - A server issue prevents parsing the JWT (500)
//  - The user does not exist in the database (500)
//
// Additionally, note that including availability will update the entire tutor's
// availability while including tutoring will only update the courses specified.
//
// Body Schema: {
//     firstname?: String
//     lastname?: String
//     email?: String
//     phone?: String
//     bio?: String
//     availability?: []Availability {
//       day: String (Sunday...Saturday)
//       start: String (hh:MM AM/PM)
//       end: String (hh:MM AM/PM, >start)
//     }
//     tutoring?: []PatchTutoring {
//       code: String
//       action: Boolean
//     }
// }
// Response Schema: {}
// Error Schema: {
//   error: String
// }
func patchProfile(c *gin.Context) {
	token, err := c.Cookie("jwt")
	if err != nil {
		c.JSON(401, gin.H{
			"error": "Requires an authenticated user.",
		})
		return
	}

	claims, err := ParseJWT(token)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Unable to parse JWT: " + err.Error() + ".",
		})
		return
	}

	var body PatchProfileBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request: " + err.Error() + ".",
		})
		return
	}

	var users []User
	DB.Limit(1).Find(&users, "username = ?", claims.Username)
	if len(users) != 1 {
		c.JSON(500, gin.H{
			"error": "User " + claims.Username + " is authenticated but does not exist in the database.",
		})
		return
	}

	var tutors []Tutor
	DB.Limit(1).Find(&tutors, "user_id = ?", users[0].ID)
	if len(tutors) != 1 {
		if body.Bio != nil || body.Availability != nil || body.Tutoring != nil {
			c.JSON(400, gin.H{
				"error": "Invalid request: User is not a tutor.",
			})
			return
		}
	} else {
		//TODO: Validate Availability/Tutoring data (use binding tags?)
	}

	if body.FirstName != nil {
		users[0].FirstName = *body.FirstName
	}
	if body.LastName != nil {
		users[0].LastName = *body.LastName
	}
	if body.Email != nil {
		users[0].Email = *body.Email
	}
	if body.Phone != nil {
		users[0].Phone = *body.Phone
	}
	DB.Save(&users[0])

	if body.Bio != nil {
		DB.Model(&Tutor{}).Update("bio", *body.Bio)
	}
	if body.Availability != nil {
		//TODO: Patch behavior (delete all and set to body.Availability)
		DB.Where("tutor_id = ?", tutors[0].UserID).Delete(&Availability{})
		for _, availability := range *body.Availability {
			DB.Create(&Availability{
				TutorID:   tutors[0].UserID,
				Day:       availability.Day,
				StartTime: availability.StartTime,
				EndTime:   availability.EndTime,
			})
		}
	}
	if body.Tutoring != nil {
		for _, tutoring := range *body.Tutoring {
			var courses []Course
			DB.Limit(1).Find(&courses, "code = ?", tutoring.Code)
			if tutoring.Action {
				DB.Create(&Tutoring{TutorID: tutors[0].UserID, CourseID: courses[0].ID})
			} else {
				DB.Delete(&Tutoring{TutorID: tutors[0].UserID, CourseID: courses[0].ID})
			}
		}
	}

	c.JSON(200, gin.H{})
}
