package src

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	
	"strings"
	"strconv"
	"fmt"
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
	Router.GET("/tutors/:username", getTutorsUsername)
	Router.POST("/signup", postSignup)
	Router.POST("/signin", postSignin)
	Router.POST("/signout", postSignout)
	Router.GET("/profile", getProfile)
	Router.PATCH("/profile", patchProfile)
	Router.PATCH("/availability", patchAvailability)
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
// with all tutors ordered by username. If the course :code is not defined,
// returns a 404 with an error message.
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
//     email: String
//     phone: String
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
	DB.Joins("Tutor").Joins("LEFT JOIN users User ON id = Tutor__user_id").Preload("Tutor.User").Order("User.username").Find(&tutorings, "course_id = ?", courses[0].ID)
	tutors := make([]Tutor, len(tutorings))
	for i, tutoring := range tutorings {
		//TODO: Limit the amount of data being returned
		tutors[i] = tutoring.Tutor
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

// Handler for /tutors/:username. Returns the tutor identified by :username
// along with all courses tutored ordered by code. If the tutor :username is
// not defined, returns a 404 with an error message.
//
// Response Schema: {
//   tutor: Tutor {
//     username: String
//     firstname: String
//     lastname: String
//     email: String
//     phone: String
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
	DB.Joins("User").Limit(1).Find(&tutors, "User__username = ?", username)
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

	//TODO: Validate username/password

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

	//TODO: Validate username/password

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
	c.SetCookie("jwt", token, int(24*time.Hour.Seconds()), "", "", false, true)  //FIX THIS

	c.JSON(200, gin.H{})
}

// Handler for /signout. Signs out the user if currently authenticated. Returns
// an empty object.
//
// Response Schema: {}
func postSignout(c *gin.Context) {
	c.SetCookie("jwt", "", 0, "", "", true, true)

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
	DB.Limit(1).Find(&tutors, "user_id = ?", users[0].ID)
	if len(tutors) != 1 {
		c.JSON(200, gin.H{
			"profile": users[0],
		})
	}
	tutors[0].User = users[0]

	c.JSON(200, gin.H{
		"profile": tutors[0],
	})
}

// JSON Schema for updating the profile
// None or all of these attributes (accept for ID) can be used when send to PATCH /profile
// for updating of the profile
// Submit as { "attr": "val", "attr": "val" }
type ClassItem struct {
	Code   string `json:"code"`
	Action bool   `json:"action"`
}

type ProfileUpdateData struct {
	ID           uint        `json:"-"`
	FirstName    string      `json:"firstname"`
	LastName     string      `json:"lastname"`
	Email        string      `json:"email"`
	Phone        string      `json:"phone"`
	Bio          string      `json:"bio"`
	Availability string      `json:"availability"`
	Tutoring     []ClassItem `json:"tutoring"`
}

// Handler for PATCH /profile. Returns a success string if update operation is complete.
// Errors if:
//
//  - There is no authenticated user (401)
//  - A server issue prevents parsing the JWT (500)
//  - The changed data does not fit the json schema detailed in ProfileUpdateData (400)
//
// Response Schema: {
//   200
// }
// Error Schema: {
//   error: String
// }
//Source Note: https://blog.logrocket.com/how-to-build-a-rest-api-with-golang-using-gin-and-gorm/

/*
Need to add:
Error to check if user exists in DB (500 error)
Prevent changes to ID
Add edit of classes
Add as a tutor if editing tutor portion (assuming it is left as blank on the profile until edited by user)
Check for sending extra json data that is not used (ie tutor stuff for nontutor). Currently assumes proper stuff sent
Currently assumes class actions are correct and frontend is telling the truth
*/

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

	var edits ProfileUpdateData
	if err := c.ShouldBindJSON(&edits); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	var tutors []Tutor
	DB.Joins("User").Find(&tutors, "User__username = ?", claims.Username)

	if len(tutors) > 0 {
		if edits.Bio != "" {
			tutors[0].Bio = edits.Bio
		}
		if edits.Availability != "" {
			tutors[0].Availability = edits.Availability
		}
		DB.Save(&tutors)
	}

	if len(tutors) > 0 && len(edits.Tutoring) > 0 {
		for i := 0; i < len(edits.Tutoring); i++ {
			var courses []Course
			DB.Find(&courses, "code = ?", edits.Tutoring[i].Code)
			if edits.Tutoring[i].Action {
				//add class
				newClass := Tutoring{Tutor: tutors[0], Course: courses[0]}
				DB.Create(&newClass)
			} else {
				//remove class
				DB.Where("tutor_id = ? AND course_id = ?", tutors[0].UserID, courses[0].ID).Delete(&Tutoring{})
			}
		}
	}

	//It's angry at me, so I'm doing it this less pretty way, even though the nice way used to work. Tutor class stuff put it to flames
	//So long, old way. Rest in reeses pieces. You will be missed.
	var users []User
	DB.Find(&users, "username = ?", claims.Username)
	if edits.FirstName != "" {
		users[0].FirstName = edits.FirstName
	}
	if edits.LastName != "" {
		users[0].LastName = edits.LastName
	}
	if edits.Email != "" {
		users[0].Email = edits.Email
	}
	if edits.Phone != "" {
		users[0].Phone = edits.Phone
	}
	DB.Save(&users)
	//DB.Model(&users[0]).Updates(edits)

	c.JSON(200, gin.H{})
}


type EntryTimeSlot struct {
	Day        string  `json:"day"`
	StartTime  string  `json:"starttime"`
	EndTime    string  `json:"endtime"`
	Action	   bool    `json:"action"`
}

type AvailabilityUpdateData struct {
	Availability []EntryTimeSlot `json:"availability"`
} 
//yeah yeah, I know this is ugly, but that's all my brain can come with at this time at night
type CalculationEntry struct {
	Day        string  `json:"day"`
	StartTime  int     `json:"starttime"`
	EndTime    int     `json:"endtime"`
}

func translateTime(time string) int {
	time = strings.ToLower(strings.ReplaceAll(time, ":", ""))
	if strings.Contains(time, "am") {
		time = strings.TrimSpace(strings.ReplaceAll(time, "am", ""))
		result, err := strconv.Atoi(time)
		if err != nil {
			return -1 //error: not a valid time number
		}
		return result
	} else if strings.Contains(time, "pm") {
		time = strings.TrimSpace(strings.ReplaceAll(time, "pm", ""))
		result, err := strconv.Atoi(time)
		if err != nil {
			return -1 //error: not a valid time number
		}
		if result < 1200 {
			result = result + 1200
		}
		return result
	}
	return -1 //error: not a valid am/pm
}

func detranslateTime(time int) string {
	var result string
	if time >= 1300 {
		time = time - 1200
	} 
	var timeOfDay string
	if time < 1200 {
		timeOfDay = "AM"
	} else {
		timeOfDay = "PM"
	}
	result = strconv.Itoa(time)
	front := result[:len(result)/2]
	back := result[len(result)/2:len(result)]
	result = front + ":" + back + " " + timeOfDay
	return result
}

func removeTime(list []CalculationEntry, index int) []CalculationEntry {
    return append(list[:index], list[index+1:]...)
}

//This func is under the assumption that time stamps are already valid, aka, no 12:00 PM - 8:00 AM in the same day. 
func patchAvailability(c *gin.Context) {

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

	var edits AvailabilityUpdateData
	if err := c.ShouldBindJSON(&edits); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	
	var tutors []Tutor
	DB.Limit(1).Joins("User").Find(&tutors, "User__username = ?", claims.Username)
	
	if len(tutors) != 1 {
		c.JSON(400, gin.H{
			"error": "Tutor " + claims.Username + " does not exist.",
		})
		return
	}
	
	currentList := []CalculationEntry{}
	days := strings.Split(tutors[0].Availability, ",")
	for i := 0; i < len(days); i ++ {
		parts := strings.Split(strings.TrimSpace(days[i]), " ")
		curr := CalculationEntry{parts[0], translateTime(parts[1] + " " + parts[2]), translateTime(parts[3] + " " + parts[4])}
		if curr.StartTime == -1 || curr.EndTime == -1 {
			c.JSON(400, gin.H{
				"error": "Invalid time stamp: " +  parts[0] + " " + parts[1] + " " + parts[2] + " " + parts[3] + " " + parts[4],
			})
			return
		}
		currentList = append(currentList, curr)
	}

	fmt.Println(currentList)
	
	//loop through and remove 
	for i := 0; i < len(edits.Availability); i++ {
		if !edits.Availability[i].Action {
			for j := 0; j < len(currentList); j ++ {
				if currentList[j].Day == edits.Availability[i].Day && currentList[j].StartTime == translateTime(edits.Availability[i].StartTime) && currentList[j].EndTime == translateTime(edits.Availability[i].EndTime) {
					//as a draft version, I am assuming that the times match up with current listing (AKA, has 2-4, removing 2-4. No frankenstein)
					currentList = removeTime(currentList, j)
				}
			}
		}
	}
	
	fmt.Println(currentList)
	
	//calculate new things to add, currently under the assumption that new things are unique and can not be murged with current entries
	
	
	//add those things
	for i := 0; i < len(edits.Availability); i++ {
		if edits.Availability[i].Action {
			curr := CalculationEntry{edits.Availability[i].Day, translateTime(edits.Availability[i].StartTime), translateTime(edits.Availability[i].EndTime)}
			if curr.StartTime == -1 || curr.EndTime == -1 {
				c.JSON(400, gin.H{
					"error": "Invalid time stamp: " +  edits.Availability[i].Day + " " + edits.Availability[i].StartTime + " " + edits.Availability[i].EndTime,
				})
				return
			}
			currentList = append(currentList, curr)
		}
	}
	
	fmt.Println(currentList)
	
	//edit db
	//do the ava need to be in day-of-the-week order? Need to add that if so
	var giantString string
	for i := 0; i < len(currentList); i ++ {
		giantString = giantString + currentList[i].Day + " " + detranslateTime(currentList[i].StartTime) + " " + detranslateTime(currentList[i].EndTime) 
		if i + 1 != len(currentList) {
			giantString = giantString + ", "
		}
	}
	fmt.Println(giantString)
	tutors[0].Availability = giantString
	DB.Save(&tutors)
	
	c.JSON(200, gin.H{})
}