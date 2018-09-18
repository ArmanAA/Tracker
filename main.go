package main

import (
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/rs/xid"
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
	Path      string
	UserAgent string
	UniqueID  string `sql:"index"`
}
type WebsiteRegisterJson struct {
	Username string `json:"username"`
	Url      string `json:"url"`
}
type Path struct {
	gorm.Model
	Path     string
	UniqueID string
}
type PathTrackJson struct {
	Username string `json:"username"`
	Url      string `json:"url"`
	Path     string `json:"path"`
}

type TimeInterval struct {
	Username  string        `json:"username"`
	Url       string        `json:"url"`
	StartTime string        `json:"startTime"`
	EndTime   string        `json:"endTime"`
	UrlCount  []TrackOutput `json:"data"`
}
type TrackOutput struct {
	Url   string
	Count int
}

func main() {

	router := gin.Default()
	router.Use(cors.Default())
	//handles requests from dashboard
	apiDash := router.Group("api/dash")
	//handles requests from tacked paged
	apiTracker := router.Group("/api/tracker")

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// <------*****       DB stuff       *****------->
	//Set up database
	db, err := gorm.Open("sqlite3", "./db/gorm.db")
	if err != nil {
		panic(err.Error())

	}
	err = db.DB().Ping()
	db.DropTableIfExists(&User{}, &RegisteredWebsites{}, &TrackStatus{}, &Path{})
	db.AutoMigrate(&User{}, &RegisteredWebsites{}, &TrackStatus{}, &Path{})

	defer db.Close()
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//<------****	Dashboard API 	//<------****
	//sign up handler
	apiDash.POST("/signup", func(c *gin.Context) {
		var user User

		if err := c.Bind(&user); err == nil {

			if checkUsername(user.Username, *db) {
				// Generate "hash" to store from user password

				hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
				if err != nil {
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
	//log in handler
	apiDash.PUT("/login", func(c *gin.Context) {
		var loginJson loginData

		if err := c.Bind(&loginJson); err == nil {

			if checkCredentials(loginJson.Username, loginJson.Password, *db) {

				user := getUser(loginJson.Username, *db)
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
	//register websites handler
	apiDash.POST("/registerwebsite", func(c *gin.Context) {
		var scriptJson WebsiteRegisterJson
		if err := c.BindJSON(&scriptJson); err == nil {
			userId := getUserID(scriptJson.Username, *db)
			if userId != 0 {
				registeredWeb := registerWebsite(scriptJson.Url, userId, *db)
				if registeredWeb.URL != "" {
					c.JSON(200, gin.H{
						"message": "success",
					})
				} else {
					c.JSON(http.StatusBadRequest, gin.H{})
				}

			} else {
				c.JSON(http.StatusNotAcceptable, gin.H{})
			}
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}

	})
	//getting report of websites

	apiDash.GET("/webtrackhistory/:username", func(c *gin.Context) {
		username := c.Param("username")

		id := getUserID(username, *db)
		outputTracks := getWebTracks(id, *db)
		c.JSON(http.StatusOK, gin.H{
			"message": outputTracks,
		})
	})
	//getting report of different paths for a websiite
	apiDash.GET("/getPathReport/:username/:url", func(c *gin.Context) {
		username := c.Param("username")
		url := c.Param("url")
		id := getUserID(username, *db)
		regWeb := getRegisteredWeb(url, id, *db)
		outputTracks := getPathTracks(regWeb.UniqueID, *db)
		if len(outputTracks) > 0 {
			c.JSON(http.StatusOK, gin.H{
				"message": outputTracks,
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}

	})
	//page view over time interval handler
	apiDash.POST("/tracktimeinterval", func(c *gin.Context) {
		outputs := []TrackOutput{}
		var timeInterval TimeInterval

		if err := c.BindJSON(&timeInterval); err == nil {
			id := getUserID(timeInterval.Username, *db)

			for _, element := range timeInterval.UrlCount {
				registeredWeb := getRegisteredWeb(element.Url, id, *db)
				if registeredWeb.UniqueID == "" {
					fmt.Println("path==== ", element.Url)
					count := getPVPathInTimeInterval(timeInterval.StartTime, timeInterval.EndTime, element.Url, *db)
					outputs = append(outputs, TrackOutput{Url: element.Url, Count: count})
				} else {
					fmt.Println("domain==== ", element.Url)
					count := getPVWebInTimeInterval(timeInterval.StartTime, timeInterval.EndTime, registeredWeb.UniqueID, *db)
					outputs = append(outputs, TrackOutput{Url: element.Url, Count: count})
				}

			}

			c.JSON(http.StatusAccepted, gin.H{
				"message": outputs,
			})
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}
	})
	apiDash.GET("/getScript/:username/:url", func(c *gin.Context) {

		username := c.Param("username")
		url := c.Param("url")
		userId := getUserID(username, *db)
		if userId != 0 {
			registeredWeb := getRegisteredWeb(url, userId, *db)
			if registeredWeb.URL != "" {
				script := generateScript(registeredWeb.UniqueID)
				c.JSON(200, gin.H{
					"message": script,
				})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{})
			}

		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}

	})
	apiDash.POST("/addPathTrack", func(c *gin.Context) {
		var pathJson PathTrackJson
		if err := c.BindJSON(&pathJson); err == nil {
			userId := getUserID(pathJson.Username, *db)
			if userId != 0 {
				registeredWeb := getRegisteredWeb(pathJson.Url, userId, *db)
				if registeredWeb.URL != "" {
					if pathAlreadyAdded(pathJson.Path, registeredWeb.UniqueID, *db) == false {
						path := Path{
							Path:     pathJson.Path,
							UniqueID: registeredWeb.UniqueID,
						}
						db.Debug().Create(&path)
						c.JSON(200, gin.H{})
					} else {
						c.JSON(http.StatusNotAcceptable, gin.H{})
					}

				} else {
					c.JSON(http.StatusBadRequest, gin.H{})
				}

			} else {
				c.JSON(http.StatusNotAcceptable, gin.H{})
			}
		} else {
			c.JSON(http.StatusNotAcceptable, gin.H{})
		}
	})
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//for loop query paths
	//
	//<------****/		Tracker API  	//<------****
	//handling pings when a tracked page is viewed
	apiTracker.GET("/ping", func(c *gin.Context) {
		var track TrackStatus

		path := c.Request.URL.Query().Get("path")
		in, _ := url.QueryUnescape(path)
		unique_id := c.Request.URL.Query().Get("UniqueID")
		user_agent := c.Request.Header.Get("User-Agent")

		track = TrackStatus{
			Path:      in,
			UniqueID:  unique_id,
			UserAgent: user_agent,
		}
		fmt.Println("path===", track.Path)
		db.Debug().Create(&track)

		c.JSON(200, gin.H{
			"message": "pong",
		})

	})

	router.Run() // listen and serve on 0.0.0.0:8080
}

//
func checkCredentials(username string, password string, db gorm.DB) bool {
	user := User{}
	db.Debug().Where("username = ? ", username).Find(&user)

	if "" != user.Username {
		hashFromDatabase := []byte(user.Password)
		// Comparing the password with the hash
		if err := bcrypt.CompareHashAndPassword(hashFromDatabase, []byte(password)); err != nil {
			return false
		} else {
			return true
		}
	} else {
		return false
	}

}

// Helper Functions ---->

func getPVPathInTimeInterval(startTime string, endTime string, path string, db gorm.DB) int {
	var count int

	db.Debug().Model(&TrackStatus{}).Where("created_at BETWEEN ? AND ? AND path = ? ", startTime, endTime, path).Count(&count)
	return count

}
func getPVWebInTimeInterval(startTime string, endTime string, path string, db gorm.DB) int {
	var count int
	db.Debug().Model(&TrackStatus{}).Where("created_at BETWEEN ? AND ? AND unique_id = ? ", startTime, endTime, path).Count(&count)
	return count

}
func getWebTracks(userId uint, db gorm.DB) []TrackOutput {
	var count int
	outputs := []TrackOutput{}
	registeredWebs := []RegisteredWebsites{}
	db.Where("user_id = ?", userId).Find(&registeredWebs)
	for _, element := range registeredWebs {
		db.Model(&TrackStatus{}).Where("unique_id = ?", element.UniqueID).Count(&count)
		outputs = append(outputs, TrackOutput{Url: element.URL, Count: count})
	}

	return outputs
}
func getPathTracks(unique_id string, db gorm.DB) []TrackOutput {
	var count int
	outputs := []TrackOutput{}
	tempPath := Path{}
	db.Model(&Path{}).Where("unique_id = ?", unique_id).Find(&tempPath)
	if tempPath.UniqueID != "" {
		db.Model(&TrackStatus{}).Where("unique_id = ?", tempPath.UniqueID).Count(&count)
		webURL := getWebURL(unique_id, db)
		outputs = append(outputs, TrackOutput{Url: webURL, Count: count})
		db.Model(&TrackStatus{}).Where("path = ?", tempPath.Path).Count(&count)
		outputs = append(outputs, TrackOutput{Url: tempPath.Path, Count: count})
	}

	return outputs
}
func getWebURL(unique_id string, db gorm.DB) string {
	registeredWeb := RegisteredWebsites{}
	db.Where("unique_id = ?", unique_id).First(&registeredWeb)
	return registeredWeb.URL
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
	var count int
	regWeb := RegisteredWebsites{}
	emptyRegWeb := RegisteredWebsites{}
	registerWeb := RegisteredWebsites{
		URL:      url,
		UniqueID: uniqueID,
		UserID:   userId,
	}
	db.Debug().Where("url = ? AND user_id = ?", url, userId).Find(&regWeb).Count(&count)
	if count == 0 {
		db.Create(&registerWeb)
		return registerWeb
	}
	return emptyRegWeb

}
func getRegisteredWeb(url string, userId uint, db gorm.DB) RegisteredWebsites {

	regWeb := RegisteredWebsites{}

	db.Debug().Where("url = ? AND user_id = ?", url, userId).Find(&regWeb)

	return regWeb
}

func genXid(db gorm.DB) string {
	id := xid.New()

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
	script := "<script>	const id = " + "\"" + id + "\"" + ";$(document).ready(function(){	$.ajax({ url:" + url + ",	context: document.body,	type: \"get\",	data:{UniqueID:" + "\"" + id + "\"" + ", path: window.encodeURIComponent(window.location.pathname)" + "	},	success: function(){	console.log(\"success\")	}	,	error: function() {console.log(\"ERROR AJAX\")}});});</script>"
	//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	return script
}

func getUserID(username string, db gorm.DB) uint {
	user := User{}

	db.Debug().Where("username = ?", username).First(&user)

	if user.Username != "" {

		return user.ID
	} else {
		return 0
	}

}
func pathAlreadyAdded(path string, unique_id string, db gorm.DB) bool {
	myPath := Path{}
	db.Debug().Where("path = ? AND unique_id = ?", path, unique_id).Find(&myPath)
	if myPath.UniqueID != "" {
		return true
	}
	return false
}
