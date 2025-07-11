package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"voting/services"
)

func RegisterVoterHandler(c *gin.Context) {
	var req struct {
		VoterID int `json:"voterId"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	if services.RegisterVoter(req.VoterID){
		c.JSON(http.StatusOK, gin.H{"message": "Voter registered"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Voter already registered"})
	}
}

func CastVoteHandler(c *gin.Context) {
	var req struct {
		VoterID   int    `json:"voterId"`
		Candidate string `json:"candidate"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	success, msg := services.CastVote(req.VoterID, req.Candidate)
	if success {
		c.JSON(http.StatusOK, gin.H{"message": msg})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
	}
}

func GetCandidatesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, services.Candidates)
}

func GetBlockchainHandler(c *gin.Context) {
	c.JSON(http.StatusOK, services.Blockchain)
}