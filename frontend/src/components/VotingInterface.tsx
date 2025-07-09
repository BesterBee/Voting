import React, { useState, useEffect } from 'react';
import { Vote, BarChart3, Clock, Shield, CheckCircle } from 'lucide-react';
import { VotingService } from '../services/VotingService';
import { Ballot, Voter } from '../types/voting';

interface VotingInterfaceProps {
  votingService: VotingService;
  currentVoter: Voter;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  votingService,
  currentVoter
}) => {
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [selectedBallot, setSelectedBallot] = useState<Ballot | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setBallots(votingService.getActiveBallots());
  }, [votingService]);

  const handleVote = async () => {
    if (!selectedBallot || selectedOption === -1) {
      setError('Please select a ballot and option');
      return;
    }

    setIsVoting(true);
    setError('');

    try {
      await votingService.castVote(currentVoter.id, selectedBallot.id, selectedOption);
      setVoteSuccess(true);
      setSelectedBallot(null);
      setSelectedOption(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voting failed');
    } finally {
      setIsVoting(false);
    }
  };

  const hasVotedForBallot = (ballotId: string) => {
    const votes = votingService.getBlockchainInfo().totalVotes;
    return votes > 0 && votingService.getVotesForBallot(ballotId)
      .some(vote => vote.voterPublicKey === currentVoter.publicKey);
  };

  if (voteSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-green-800 mb-4">Vote Cast Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your vote has been securely recorded on the blockchain
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Blockchain Verification</span>
            </div>
            <p className="text-green-700 text-sm">
              Your vote is now part of the immutable blockchain ledger
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Ballots</h2>
            <p className="text-gray-600">Choose a ballot to cast your vote</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Voter ID: {currentVoter.id}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ballots.map((ballot) => (
            <div
              key={ballot.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedBallot?.id === ballot.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${hasVotedForBallot(ballot.id) ? 'opacity-50' : ''}`}
              onClick={() => !hasVotedForBallot(ballot.id) && setSelectedBallot(ballot)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{ballot.title}</h3>
                {hasVotedForBallot(ballot.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{ballot.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{ballot.options.length} options</span>
                <span>
                  {hasVotedForBallot(ballot.id) ? 'Voted' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {ballots.length === 0 && (
          <div className="text-center py-12">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Ballots</h3>
            <p className="text-gray-600">There are currently no ballots available for voting</p>
          </div>
        )}
      </div>

      {selectedBallot && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Cast Your Vote: {selectedBallot.title}
          </h3>
          
          <div className="space-y-3 mb-6">
            {selectedBallot.options.map((option, index) => (
              <label
                key={index}
                className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="voteOption"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{option}</span>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedBallot(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVote}
              disabled={isVoting || selectedOption === -1}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium"
            >
              {isVoting ? 'Casting Vote...' : 'Cast Vote'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};