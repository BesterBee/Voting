package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"voting/services"
	"voting/models"
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
		CandidateID string `json:"candidateId"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	success, msg := services.CastVote(req.VoterID, req.CandidateID)
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
	totalVotes := 0
	for _, block := range services.Blockchain {
		totalVotes += len(block.Votes)
	}

	response := models.BlockchainResponse{
		Blocks:      services.Blockchain,
		Voters:      services.Voters,
		Candidates:  services.CandidatesSlice(),
		AuditEvents: services.AuditTrail,
		Stats: models.Stats{
			TotalVoters:      len(services.Voters),
			TotalVotes:       totalVotes,
			TotalCandidates:  len(services.Candidates),
			BlockchainBlocks: len(services.Blockchain),
			VotingActive:     services.VotingActive,
		},
	}

	c.JSON(http.StatusOK, response)
}
