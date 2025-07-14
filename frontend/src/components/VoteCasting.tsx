import React, { useState, useEffect } from 'react';
import { Vote, User, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useVoting } from '../contexts/useVoting';

export function VoteCasting() {
  const { state, castVote, loadCandidates } = useVoting();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voterId, setVoterId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !voterId) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      await castVote(voterId, selectedCandidate);
      setSelectedCandidate('');
      setVoterId('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Vote casting failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedCandidate && voterId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Vote className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
            <p className="text-gray-600">Select your preferred candidate and cast your vote securely</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">Your vote has been successfully recorded on the blockchain!</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleVoteSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Voter ID
            </label>
            <input
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your voter ID"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Use the voter ID you received during registration
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Candidate
            </label>
            <div className="space-y-3">
              {state.candidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading candidates...</p>
                </div>
              ) : (
                state.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCandidate === candidate.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate.id}
                        checked={selectedCandidate === candidate.id}
                        onChange={() => setSelectedCandidate(candidate.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                            <p className="text-sm text-gray-600">{candidate.party}</p>
                            {candidate.description && (
                              <p className="text-sm text-gray-500 mt-1">{candidate.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Current Votes</p>
                            <p className="font-semibold text-gray-900">{candidate.votes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Important Notice</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Your vote will be permanently recorded on the blockchain and cannot be changed. 
                  Please verify your selection before submitting.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || state.isLoading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting || state.isLoading ? 'Casting Vote...' : 'Cast Vote'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Blockchain Verification</h3>
          <p className="text-sm text-gray-600">
            Your vote will be cryptographically secured and added to the blockchain, ensuring 
            complete transparency while maintaining voter privacy through anonymous voting.
          </p>
        </div>
      </div>
    </div>
  );
}