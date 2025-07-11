package models

type Vote struct {
	VoterID   int    `json:"voterId"`
	Candidate string `json:"candidate"`
	Signature string `json:"signature"`
}

type Block struct {
	PrevHash    string `json:"prevHash"`
	CurrentHash string `json:"currentHash"`
	Votes       []Vote `json:"votes"`
}