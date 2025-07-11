package services

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"voting/models"
)

var Blockchain []models.Block
var Candidates map[string]int
var VoterReg map[int]bool
var VotersWhoVoted map[int]bool

func Init() {
	Candidates = make(map[string]int)
	VoterReg = make(map[int]bool)
	VotersWhoVoted = make(map[int]bool)
	Blockchain = []models.Block{}

	Candidates["Alice"] = 0
	Candidates["Bob"] = 0
	Candidates["Jane"] = 0
	Candidates["John"] = 0

	genesisBlock := models.Block{
		PrevHash:    "",
		CurrentHash: "",
		Votes:       nil,
	}
	genesisBlock.CurrentHash = GenerateHash(genesisBlock)
	Blockchain = append(Blockchain, genesisBlock)

}

func GenerateHash(block models.Block) string {
	data, _ := json.Marshal(block)
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])

}

func CalculateHash(block models.Block, vote models.Vote) string {
	hash := sha256.Sum256([]byte(fmt.Sprintf("%v %v", block, vote)))
	return fmt.Sprintf("%x", hash)
}

func RegisterVoter(voterID int) bool {
	if _, exists := VoterReg[voterID]; exists {
		return false
	}
	VoterReg[voterID] = true
	return true
}

func CastVote(voterID int, candidate string) (bool, string) {
	if !VoterReg[voterID] {
		return false, "Voter is not registered."
	}

	if _, exists := Candidates[candidate]; !exists {
		return false, "Candidate does not exist."
	}

	if VotersWhoVoted[voterID] {
		return false, "Voter has already voted."
	}

	VotersWhoVoted[voterID] = true

	vote := models.Vote{VoterID: voterID, Candidate: candidate}
	lastBlock := Blockchain[len(Blockchain)-1]
	newBlock := models.Block{
		PrevHash:    lastBlock.CurrentHash,
		CurrentHash: "",
		Votes:       []models.Vote{vote},
	}
	newBlock.CurrentHash = GenerateHash(newBlock)
	Blockchain = append(Blockchain, newBlock)

	Candidates[candidate]++
	VotersWhoVoted[voterID] = true

	return true, "Vote cast successfully."
}