package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

func main() {

	router := gin.Default()
	router.Use(cors.Default())
	apiDash := router.Group("api/dash")
	apiTracker := router.Group("/api/tracker")
	id := "1"
	url := "\"http://localhost:8080/api/tracker/ping\""
	script := "<script>	const id = 1;$(document).ready(function(){	$.ajax({ url:" + url + ",	context: document.body,	type: \"get\",	data:{UniqueID:" + id + "	},	success: function(){	console.log(\"success\")	}	,	error: function() {console.log(\"ERROR AJAX\")}});});</script>"
	//Dashboard API
	apiDash.GET("/script", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": script,
		})

	})
	//Tracker API
	apiTracker.GET("/ping", func(c *gin.Context) {
		var user User

		if err := c.Bind(&user); err == nil {

			c.JSON(http.StatusCreated, user)

		} else {
			c.JSON(http.StatusBadRequest, gin.H{})
		}
		fmt.Println("params from post: ", user)
		fmt.Println(*c.Request)

	})

	//DB stuff

	router.Run() // listen and serve on 0.0.0.0:8080
}

type User struct {
	UniqueID string `json:"UserID"`
}
