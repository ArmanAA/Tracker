package main

import (
	"fmt"
	"log"
	"net/http"

	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
	"github.com/rs/xid"

	//	"encoding/json"
	"golang.org/x/crypto/bcrypt"
)

// Structs <----****---->
type User struct {
	gorm.Model
	Username           string `json:"username"`
	Password           string `json:"password"`
	Email              string `json:"email"`
	RegisteredWebsites []RegisteredWebsites
}
type loginData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type RegisteredWebsites struct {
	gorm.Model
	UniqueID    string
	URL         string
	UserID      uint `sql:"index"`
	TrackStatus []TrackStatus
}
type TrackStatus struct {
	gorm.Model
	UserAgent string
	UniqueID  string `sql:"index"`
}
type ScriptGetter struct {
	Username string `json:"username"`
	Url      string `json:"url"`
}

func main() {

	router := gin.Default()
	router.Use(cors.Default())
	apiDash := router.Group("api/dash")
	apiTracker := router.Group("/api/tracker")

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// <------*****       DB stuff       *****------->

	db, err := gorm.Open("mysql", "root:root@/trackerdb?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic(err.Error())

	}

	err = db.DB().Ping()
	//db.DropTableIfExists(&User{})
	//db.DropTableIfExists(&User{}, &RegisteredWebsites{}, &TrackStatus{})
	db.AutoMigrate(&User{}, &RegisteredWebsites{}, &TrackStatus{})
	// myuser := User{
	// 	Username: "arman",
	// 	Password: "helloworld",
	// 	Email:    "arman@yahoo.com",
	// }
	// website := RegisteredWebsites{
	// 	UniqueID: "1223",
	// 	URL:      "youtube.com",
	// 	UserID:   1,
	// }
	// websitefb := RegisteredWebsites{
	// 	UniqueID: "1111",
	// 	URL:      "facebook.com",
	// 	UserID:   1,
	// }
	// fbtrack := TrackStatus{
	// 	UserAgent: "Mozilla",
	// 	UniqueID:  "1111",
	// }
	// fbtrack1 := TrackStatus{
	// 	UserAgent: "Mozilla",
	// 	UniqueID:  "1223",
	// }
	// fbtrack2 := TrackStatus{
	// 	UserAgent: "Chrome",
	// 	UniqueID:  "1111",
	// }
	// db.Create(&myuser)
	// db.Create(&fbtrack)
	// db.Create(&fbtrack1)
	// db.Create(&fbtrack2)
	// db.Create(&website)
	// db.Create(&websitefb)
	//	getWebTracks(1, *db)
	// if !db.HasTable(&User{}) {
	// 	db.CreateTable(&User{})
	// }

	defer db.Close()
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//<------****	Dashboard API 	//<------****
	apiDash.POST("/signup", func(c *gin.Context) {
		var user User

		if err := c.Bind(&user); err == nil {
			fmt.Println("params from user: ", user)
			if checkUsername(user.Username, *db) {
				// Generate "hash" to store from user password

				hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
				if err != nil {
					// TODO: Properly handle error
					log.Fatal(err)
				}
				user.Password = string(hash)

				createUser(&user, *db)
				c.JSON(http.StatusCreated, user)
			} else {
				c.JSON(http.StatusNotAcceptable, gin.H{})
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
	})
	apiDash.PUT("/login", func(c *gin.Context) {
		var loginJson loginData

		if err := c.Bind(&loginJson); err == nil {
			fmt.Println("params from login: ", loginJson)
			if checkCredentials(loginJson.Username, loginJson.Password, *db) {

				user := getUser(loginJson.Username, *db)
				// cookie = &http.Cookie{
				// 	Name:  "logged-in",
				// 	Value: "1",
				// }
				c.JSON(http.StatusOK, gin.H{
					"userID":   user.ID,
					"username": user.Username,
				})
			} else {
				c.JSON(http.StatusNotAcceptable, gin.H{})
			}
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}

	})
	apiDash.POST("/registerwebsite", func(c *gin.Context) {
		var scriptJson ScriptGetter
		if err := c.BindJSON(&scriptJson); err == nil {
			userId := getUserID(scriptJson.Username, *db)
			if userId != 0 {
				registeredWeb := registerWebsite(scriptJson.Url, userId, *db)
				script := generateScript(registeredWeb.UniqueID)
				c.JSON(200, gin.H{
					"message": script,
				})
			} else {
				c.JSON(http.StatusNotAcceptable, gin.H{})
			}
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}

	})
	apiDash.GET("/webtrackhistory/:username", func(c *gin.Context) {
		username := c.Param("username")
		id := getUserID(username, *db)
		outputTracks := getWebTracks(id, *db)
		//	jsonTracks, _ := json.Marshal(outputTracks)
		c.JSON(http.StatusOK, gin.H{
			"message": outputTracks,
		})
	})
	apiDash.POST("/tracktimeinterval", func(c *gin.Context) {
		var timeInterval TimeInterval

		if err := c.BindJSON(&timeInterval); err == nil {
			fmt.Println("start time:", timeInterval.StartTime)
			fmt.Println("end time:", timeInterval.EndTime)
			id := getUserID(timeInterval.Username, *db)
			count := getPageViewInTimeInterval(timeInterval.StartTime, timeInterval.EndTime, id, timeInterval.Url, *db)
			t := strconv.Itoa(count)
			//fmt.Println(t)
			fmt.Println("bitch ass count is: ", t)
			c.JSON(http.StatusAccepted, gin.H{
				"count": t,
			})
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}
	})
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//<------****/		Tracker API  	//<------****

	apiTracker.GET("/ping", func(c *gin.Context) {
		var track TrackStatus
		fmt.Println("in ping")
		if err := c.Bind(&track); err == nil {
			unique_id := track.UniqueID
			user_agent := c.Request.Header.Get("User-Agent")
			track := TrackStatus{
				UniqueID:  unique_id,
				UserAgent: user_agent,
			}
			db.Debug().Create(&track)
		}
		c.JSON(200, gin.H{
			"message": "pong",
		})

	})

	router.Run() // listen and serve on 0.0.0.0:8080
}

type TimeInterval struct {
	Username  string `json:"username"`
	Url       string `json:"url"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
}

func checkCredentials(username string, password string, db gorm.DB) bool {
	user := User{}
	db.Debug().Where("username = ? ", username).Find(&user)

	if "" != user.Username {
		hashFromDatabase := []byte(user.Password)
		// Comparing the password with the hash
		if err := bcrypt.CompareHashAndPassword(hashFromDatabase, []byte(password)); err != nil {
			// TODO: Properly handle error
			log.Fatal(err)
			return false
		} else {
			return true
		}
	} else {
		return false
	}

}

type TrackOutput struct {
	Url   string
	Count int
}

func getPageViewInTimeInterval(startTime string, endTime string, userId uint, url string, db gorm.DB) int {
	var count int
	tracks := []TrackStatus{}
	registeredWebs := RegisteredWebsites{}
	db.Where("user_id = ? AND url = ?", userId, url).Find(&registeredWebs)

	db.Debug().Where("created_at BETWEEN ? AND ? AND unique_id = ? ", startTime, endTime, registeredWebs.UniqueID).Find(&tracks).Count(&count)

	return count
}

func getWebTracks(userId uint, db gorm.DB) []TrackOutput {
	//m := make(map[string]string)
	var count int
	outputs := []TrackOutput{}
	registeredWebs := []RegisteredWebsites{}
	db.Where("user_id = ?", userId).Find(&registeredWebs)
	for _, element := range registeredWebs {
		db.Model(&TrackStatus{}).Where("unique_id = ?", element.UniqueID).Count(&count)
		outputs = append(outputs, TrackOutput{Url: element.URL, Count: count})
	}
	fmt.Println("outputs:  ", outputs)
	return outputs
}

func checkUsername(username string, db gorm.DB) bool {
	user := User{}
	db.Debug().Where("username = ?", username).First(&user)
	if "" != user.Username {
		return false
	} else {
		return true
	}
}
func createUser(user *User, db gorm.DB) {
	db.Debug().Create(user)
}
func getUser(username string, db gorm.DB) User {
	user := User{}
	db.Debug().Where("username = ?", username).First(&user)
	return user
}

func registerWebsite(url string, userId uint, db gorm.DB) RegisteredWebsites {
	uniqueID := genXid(db)
	registerWeb := RegisteredWebsites{
		URL:      url,
		UniqueID: uniqueID,
		UserID:   userId,
	}
	db.Create(&registerWeb)
	return registerWeb
}

func genXid(db gorm.DB) string {
	id := xid.New()
	fmt.Printf("github.com/rs/xid:           %s\n", id.String())
	registeredWeb := RegisteredWebsites{}
	db.Where("unique_id = ?", id.String()).First(&registeredWeb)
	if registeredWeb.UniqueID != "" {
		return genXid(db)
	} else {
		return id.String()
	}

}
func generateScript(uniqueId string) string {
	id := uniqueId
	url := "\"http://localhost:8080/api/tracker/ping\""
	script := "<script>	const id = " + "\"" + id + "\"" + ";$(document).ready(function(){	$.ajax({ url:" + url + ",	context: document.body,	type: \"get\",	data:{UniqueID:" + "\"" + id + "\"" + "	},	success: function(){	console.log(\"success\")	}	,	error: function() {console.log(\"ERROR AJAX\")}});});</script>"
	return script
}

func getUserID(username string, db gorm.DB) uint {
	user := User{}

	db.Debug().Where("username = ?", username).First(&user)
	fmt.Println("typing from User:  ", user.Username)
	if user.Username != "" {

		return user.ID
	} else {
		return 0
	}

}
