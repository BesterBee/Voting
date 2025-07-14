package models
type Candidate struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Party  string `json:"party"`
	Votes  int    `json:"votes"`
}

type Voter struct {
	ID         int`json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	HasVoted   bool   `json:"hasVoted"`
	RegisteredAt int64  `json:"registeredAt"`
}

type AuditEvent struct {
	ID        string `json:"id"`
	Timestamp int64  `json:"timestamp"`
	Action    string `json:"action"`
	Actor     string `json:"actor"`
	Details   string `json:"details"`
	BlockHash string `json:"blockHash"`
}

type Vote struct {
	VoterID   int    `json:"voterId"`
	Candidate string `json:"candidate"`
	Signature string `json:"signature"`
}

type Block struct {
	ID       string `json:"id"`
	PrevHash    string `json:"prevHash"`
	CurrentHash string `json:"currentHash"`
	Votes       []Vote `json:"votes"`
}