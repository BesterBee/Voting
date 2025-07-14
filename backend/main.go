package main

import (
	"github.com/gin-gonic/gin"
	"voting/handlers"
	"voting/services"
	"github.com/gin-contrib/cors"

)

func main() {
	services.Init()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	    AllowCredentials: true,
	}))
	
	r.POST("/register", handlers.RegisterVoterHandler)
	r.POST("/vote", handlers.CastVoteHandler)
	r.GET("/candidates", handlers.GetCandidatesHandler)
	r.GET("/blockchain", handlers.GetBlockchainHandler)
	r.Run(":8080")
	
}