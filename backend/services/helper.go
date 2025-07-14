package services

import "voting/models"

func CandidatesSlice() []models.Candidate {
	result := make([]models.Candidate, 0, len(Candidates))
	for name, votes := range Candidates {
		result = append(result, models.Candidate{
			Name:  name,
			Votes: votes,
		})
	}
	return result
}
