import { useEffect } from 'react';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';
import { useVoting } from '../contexts/useVoting';

export function Results() {
  const { state, loadCandidates } = useVoting();

  useEffect(() => {
    loadCandidates();
    // Refresh results every 30 seconds
    const interval = setInterval(loadCandidates, 30000);
    return () => clearInterval(interval);
  }, [loadCandidates]);

  const totalVotes = state.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const sortedCandidates = [...state.candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const getBarWidth = (votes: number) => {
    return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Election Results</h2>
            <p className="text-gray-600">Real-time voting results from the blockchain</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Votes Cast</p>
          <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Candidates</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{state.candidates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Total Votes</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{totalVotes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Leading</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{winner?.name || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Lead Margin</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {winner && sortedCandidates[1] ? winner.votes - sortedCandidates[1].votes : 0}
          </p>
        </div>
      </div>

      {/* Results Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Vote Distribution</h3>
        <div className="space-y-4">
          {sortedCandidates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No voting data available yet</p>
            </div>
          ) : (
            sortedCandidates.map((candidate, index) => (
              <div key={candidate.id} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    <div>
                      <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.party}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{candidate.votes} votes</p>
                    <p className="text-sm text-gray-500">{getPercentage(candidate.votes)}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-green-500' : 
                      index === 1 ? 'bg-blue-500' : 
                      index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${getBarWidth(candidate.votes)}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Winner Announcement */}
      {winner && totalVotes > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Current Leader</h3>
              <p className="text-lg text-gray-700">{winner.name} ({winner.party})</p>
              <p className="text-sm text-gray-600">
                Leading with {winner.votes} votes ({getPercentage(winner.votes)}% of total)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Verification */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Blockchain Verification</h3>
        <p className="text-sm text-blue-800">
          All votes are cryptographically secured and verified on the blockchain. 
          Results are updated in real-time as new votes are cast and validated.
        </p>
        <div className="mt-2 flex items-center space-x-4 text-sm text-blue-700">
          <span>Blocks: {state.blockchain.length}</span>
          <span>•</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}