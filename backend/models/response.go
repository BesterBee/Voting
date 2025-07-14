package models

type BlockchainResponse struct {
	Blocks      []Block      `json:"blocks"`
	Voters      []Voter      `json:"voters"`
	Candidates  []Candidate  `json:"candidates"`
	AuditEvents []AuditEvent `json:"auditEvents"`
	Stats       Stats        `json:"stats"`
}

type Stats struct {
	TotalVoters       int  `json:"totalVoters"`
	TotalVotes        int  `json:"totalVotes"`
	TotalCandidates   int  `json:"totalCandidates"`
	BlockchainBlocks  int  `json:"blockchainBlocks"`
	VotingActive      bool `json:"votingActive"`
}
