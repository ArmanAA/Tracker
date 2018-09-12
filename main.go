package main

import "github.com/gin-gonic/gin"
import "github.com/gin-contrib/cors"

func main() {

	router := gin.Default()
	router.Use(cors.Default())
	api := router.Group("/api")

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	router.Run() // listen and serve on 0.0.0.0:8080
}
