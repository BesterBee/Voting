import React, { useState } from 'react';
import { User, Vote, CheckCircle, AlertCircle } from 'lucide-react';
import { BlockchainService } from '../services/BlockchainService';

interface VoterInterfaceProps {
  blockchainService: BlockchainService;
  onVoteUpdate: () => void;
}

export const VoterInterface: React.FC<VoterInterfaceProps> = ({
  blockchainService,
  onVoteUpdate
}) => {
  const [voterID, setVoterID] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const systemState = blockchainService.getSystemState();
  const candidates = Object.keys(systemState.candidates);
  const registeredVoters = blockchainService.getRegisteredVoters();

  const handleVote = async () => {
    if (!voterID || !selectedCandidate) {
      setMessage({ text: 'Please enter voter ID and select a candidate', type: 'error' });
      return;
    }

    setIsVoting(true);
    setMessage(null);

    const result = blockchainService.castVote(parseInt(voterID), selectedCandidate);
    
    setMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });

    if (result.success) {
      setVoterID('');
      setSelectedCandidate('');
      onVoteUpdate();
    }

    setIsVoting(false);
  };

  const isVoterRegistered = voterID ? registeredVoters.includes(parseInt(voterID)) : false;
  const hasVoted = voterID ? blockchainService.hasVoterVoted(parseInt(voterID)) : false;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Vote className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
          <p className="text-gray-600">Participate in the blockchain election</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="voterID" className="block text-sm font-medium text-gray-700 mb-2">
            Voter ID
          </label>
          <div className="relative">
            <input
              id="voterID"
              type="number"
              value={voterID}
              onChange={(e) => setVoterID(e.target.value)}
              placeholder="Enter your voter ID (1-10)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="10"
            />
            {voterID && (
              <div className="absolute right-3 top-3">
                {isVoterRegistered ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {voterID && !isVoterRegistered && (
            <p className="text-red-600 text-sm mt-1">Voter ID {voterID} is not registered</p>
          )}
          {voterID && isVoterRegistered && hasVoted && (
            <p className="text-orange-600 text-sm mt-1">Voter {voterID} has already voted</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Candidate
          </label>
          <div className="grid grid-cols-2 gap-3">
            {candidates.map((candidate) => (
              <label
                key={candidate}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCandidate === candidate
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate}
                    checked={selectedCandidate === candidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{candidate}</div>
                    <div className="text-sm text-gray-600">
                      {systemState.candidates[candidate]} votes
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <button
          onClick={handleVote}
          disabled={!voterID || !selectedCandidate || !isVoterRegistered || hasVoted || isVoting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium"
        >
          {isVoting ? 'Casting Vote...' : 'Cast Vote'}
        </button>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <User className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="font-medium text-gray-900">Registered Voters</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {registeredVoters.map((id) => (
            <span
              key={id}
              className={`px-2 py-1 rounded text-xs font-medium ${
                blockchainService.hasVoterVoted(id)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {id} {blockchainService.hasVoterVoted(id) ? '✓' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};