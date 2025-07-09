package main

import (
	"crypto/sha256"
	"fmt"
)

type Vote struct {
	VoterID int
	Candidate string
}

type Block struct {
	PrevHash string
	CurrentHash string 
	Votes []Vote
}

var Blockchain []Block

var Candidates map[string]int

func init() {
	Candidates = make(map[string]int)
}

var VoterReg map[int]bool

func init() {
	VoterReg = make(map[int]bool)
}

func calculateHash(block Block, vote Vote) string {

	hash := sha256.Sum256([]byte(fmt.Sprintf("%v %v", block, vote)))
	hex := fmt.Sprintf("%x", hash)
	return hex
}

func RegisterVoter(voterID int) {
	if _, exists := VoterReg[voterID]; exists {
		fmt.Printf("Voter %v is already registered.\n", voterID)
		return
	}

	VoterReg[voterID] = true
	fmt.Printf("Voter %v registered.\n", voterID)
}

func CastVote(voterID int, candidate string) {

	if _, exists := VoterReg[voterID]; !exists {
		fmt.Printf("Voter with ID %v is not registered.\n", voterID)
		return
	}

	if _, exists := Candidates[candidate]; !exists {
		fmt.Printf("Candidate %v does not exist.\n", candidate)
		return
	}

	for i :=0; i< len(Blockchain); i++ {
		for j := 0; j < len(Blockchain[i].Votes); j++ {
			if Blockchain[i].Votes[j].VoterID == voterID {
				fmt.Printf("Voter %v has already voted.\n", voterID)
				return
			}
		}

	}

	vote := Vote{VoterID: voterID, Candidate: candidate}
	lastBlock := Blockchain[len(Blockchain)-1]
	newBlock := Block{
		PrevHash: lastBlock.CurrentHash,
		CurrentHash: "",
		Votes: []Vote{vote},
	}
	newBlock.CurrentHash = calculateHash(newBlock, vote)
	Blockchain = append(Blockchain, newBlock)

	Candidates[candidate]++

	fmt.Printf("Voter %v has successfully voted for %v.\n", voterID, candidate)
}

func CalculateElectionResults() {
	fmt.Println("/nElection Results: ")
	fmt.Printf("%d candidates registered.\n", len(Candidates))
	fmt.Println("These are the results:------------")
	for i, count := range Candidates {
		fmt.Printf("Candidate %v has %d votes.\n", i, count)
	}

	var winner string
	maxVotes := -1

	for candidate, votes := range Candidates {
		if votes > maxVotes {
			maxVotes = votes
			winner = candidate
		} else if votes == maxVotes {
			winner = "It's a tie!"
		}
	}

	if winner != "It's a tie!" {
		fmt.Print("Winner is: ", winner, " with ", maxVotes, " votes.\n")
	} else {
		fmt.Print("There is a tie between candidates with ", maxVotes, " votes.\n")
	}
}

func main() {

	genesisBlock := Block{
		PrevHash: "",
		CurrentHash: "",
		Votes: nil,
	}
	Blockchain = append(Blockchain, genesisBlock)


	Candidates = make(map[string]int)
	Candidates["Alice"] = 0
	Candidates["Bob"] = 0
	Candidates["Charlie"] = 0
	Candidates["David"] = 0
	Candidates["Jane"] = 0


	for i := 1; i <= 10; i++ {
		RegisterVoter(i)
	}

	fmt.Println("/n/nCasting Votes:")
	CastVote(1, "Alice")
	CastVote(2, "Bob")
	CastVote(3, "Charlie")
	CastVote(4, "David")
	CastVote(5, "Alice")
	CastVote(6, "Alice")
	CastVote(7, "Bob")
	CastVote(8, "Jane") // Invalid candidate
	CastVote(30, "Charlie") // Invalid voter ID

	CalculateElectionResults()

	fmt.Println("\nBlockchain:")
	for i,block := range Blockchain {
		fmt.Printf("Block %d:\n", i)
		fmt.Printf("Previous Hash: %s\n", block.PrevHash)
		fmt.Printf("Current Hash: %s\n", block.CurrentHash)
		fmt.Printf("Votes: %v \n", block.Votes)
		
	}
}