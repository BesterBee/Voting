package services

import "voting/models"

func CandidatesSlice() []models.Candidate {
	result := make([]models.Candidate, 0, len(Candidates))
	for name, candidate := range Candidates {
		result = append(result, models.Candidate{
			ID:    candidate.ID,
			Name:  name,
			Party: candidate.Party,
			Votes: candidate.Votes,
		})
	}
	return result
}
