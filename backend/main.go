package main

import (
	"github.com/gin-gonic/gin"
	"voting/handlers"
	"voting/services"
)

func main() {
	services.Init()

	r := gin.Default()
	r.POST("/register", handlers.RegisterVoterHandler)
	r.POST("/vote", handlers.CastVoteHandler)
	r.GET("/candidates", handlers.GetCandidatesHandler)
	r.GET("/blockchain", handlers.GetBlockchainHandler)
	r.Run(":8080")
}