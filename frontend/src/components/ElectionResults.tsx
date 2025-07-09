import React from 'react';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';
import { BlockchainService } from '../services/BlockchainService';

interface ElectionResultsProps {
  blockchainService: BlockchainService;
}

export const ElectionResults: React.FC<ElectionResultsProps> = ({ blockchainService }) => {
  const results = blockchainService.calculateElectionResults();
  const totalVotes = blockchainService.getTotalVotes();
  const totalCandidates = Object.keys(results.candidates).length;

  const sortedCandidates = Object.entries(results.candidates)
    .sort(([, a], [, b]) => b - a);

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';
  };

  const getBarWidth = (votes: number) => {
    return totalVotes > 0 ? (votes / Math.max(...Object.values(results.candidates))) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <BarChart3 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Election Results</h2>
          <p className="text-gray-600">Live blockchain voting results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600">Total Votes</p>
              <p className="text-2xl font-bold text-blue-900">{totalVotes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600">Candidates</p>
              <p className="text-2xl font-bold text-purple-900">{totalCandidates}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600">Leading</p>
              <p className="text-2xl font-bold text-green-900">
                {results.isTie ? 'Tie' : results.winner}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Vote Distribution</h3>
        
        {sortedCandidates.map(([candidate, votes], index) => (
          <div key={candidate} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  index === 0 && !results.isTie ? 'bg-green-500' : 
                  index === 1 ? 'bg-blue-500' : 
                  index === 2 ? 'bg-purple-500' : 'bg-gray-500'
                }`} />
                <span className="font-medium text-gray-900">{candidate}</span>
                {index === 0 && !results.isTie && votes > 0 && (
                  <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{votes}</span>
                <span className="text-sm text-gray-600 ml-1">
                  ({getPercentage(votes)}%)
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === 0 && !results.isTie ? 'bg-green-500' : 
                  index === 1 ? 'bg-blue-500' : 
                  index === 2 ? 'bg-purple-500' : 'bg-gray-500'
                }`}
                style={{ width: `${getBarWidth(votes)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {results.isTie && results.maxVotes > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 font-medium">
              There is a tie between candidates with {results.maxVotes} votes each!
            </p>
          </div>
        </div>
      )}

      {totalVotes === 0 && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">No votes have been cast yet. Be the first to vote!</p>
        </div>
      )}
    </div>
  );
};