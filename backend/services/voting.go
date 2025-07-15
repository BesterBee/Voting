// backend/services/voting.go
package services

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"
	"voting/models"
	"github.com/google/uuid"
)

// ───────── global state ─────────
var Blockchain []models.Block
var Candidates map[string]models.Candidate
var Voters []models.Voter
var VoterReg map[int]bool
var VotersWhoVoted map[int]bool
var AuditTrail []models.AuditEvent // OPTIONAL: can leave nil
var VotingActive = true

// ───────── initialization ───────
func Init() {
	Candidates = make(map[string]models.Candidate)
	VoterReg = make(map[int]bool)
	VotersWhoVoted = make(map[int]bool)
	Blockchain = []models.Block{}

	// demo candidates
	Candidates["Alice"] = models.Candidate{ID: uuid.NewString(), Name: "Alice", Party: "", Votes: 0}
	Candidates["Bob"] = models.Candidate{ID: uuid.NewString(), Name: "Bob", Party: "", Votes: 0}
	Candidates["Jane"] = models.Candidate{ID: uuid.NewString(), Name: "Jane", Party: "", Votes: 0}
	Candidates["John"] = models.Candidate{ID: uuid.NewString(), Name: "John", Party: "", Votes: 0}

	genesis := models.Block{
		ID:          "0",
		PrevHash:    "",
		CurrentHash: "",
		Votes:       nil,
	}
	genesis.CurrentHash = GenerateHash(genesis)
	Blockchain = append(Blockchain, genesis)
}

// ───────── helpers ──────────────
func GenerateHash(block models.Block) string {
	data, _ := json.Marshal(block)
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])
}

func CalculateHash(block models.Block, vote models.Vote) string {
	hash := sha256.Sum256([]byte(fmt.Sprintf("%v %v", block, vote)))
	return fmt.Sprintf("%x", hash)
}

// ───────── API‑facing funcs ─────
func GetCandidates() []models.Candidate {
	candidates := []models.Candidate{}
	for _, candidate := range Candidates {
		candidates = append(candidates, models.Candidate{
			ID:    candidate.ID,
			Name:  candidate.Name,
			Party: candidate.Party,
			Votes: candidate.Votes,
		})
	}
	return candidates
}

func RegisterVoter(voterID int) bool {
	if VoterReg[voterID] {
		return false
	}
	VoterReg[voterID] = true

	Voters = append(Voters, models.Voter{
		ID:           voterID,
		HasVoted:     false,
		RegisteredAt: time.Now().Unix(),
	})
	return true
}

func CastVote(voterID int, candidate string) (bool, string) {
	if !VoterReg[voterID] {
		return false, "Voter is not registered."
	}
	if _, ok := Candidates[candidate]; !ok {
		return false, "Candidate does not exist."
	}
	if VotersWhoVoted[voterID] {
		return false, "Voter has already voted."
	}

	vote := models.Vote{VoterID: voterID, Candidate: candidate}
	last := Blockchain[len(Blockchain)-1]
	newBlock := models.Block{
		ID:          fmt.Sprintf("%d", len(Blockchain)),
		PrevHash:    last.CurrentHash,
		CurrentHash: "",
		Votes:       []models.Vote{vote},
	}
	newBlock.CurrentHash = GenerateHash(newBlock)

	Blockchain = append(Blockchain, newBlock)
	c := Candidates[candidate]
	c.Votes++
	Candidates[candidate] = c

	VotersWhoVoted[voterID] = true
	return true, "Vote cast successfully."
}
