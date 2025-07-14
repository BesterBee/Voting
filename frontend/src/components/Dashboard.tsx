import React, { useEffect } from 'react';
import { 
  Users, 
  Vote, 
  UserCheck, 
  BarChart3, 
  Activity,
  TrendingUp,
  Shield,
  Eye
} from 'lucide-react';
import { useVoting } from '../contexts/useVoting';

export function Dashboard() {
  const { state, loadCandidates, loadBlockchain } = useVoting();

  useEffect(() => {
    loadCandidates();
    loadBlockchain();
  }, [loadCandidates, loadBlockchain]);

  const isChainValid = () => {
    for (let i = 1; i < state.blockchain.length; i++) {
      const currentBlock = state.blockchain[i];
      const previousBlock = state.blockchain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  };

  const stats = {
    totalVoters: state.voters.length,
    totalVotes: state.votes.length,
    totalCandidates: state.candidates.length,
    blockchainBlocks: state.blockchain.length,
    votingActive: true,
    blockchainIntegrity: isChainValid() ? 100 : 0

  };

  type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    change?: string;
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">Blockchain Integrity: {stats.blockchainIntegrity}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Registered Voters"
          value={stats.totalVoters}
          icon={Users}
          color="bg-blue-500"
          change="+5% from last week"
        />
        <StatCard
          title="Total Votes Cast"
          value={stats.totalVotes}
          icon={Vote}
          color="bg-green-500"
        />
        <StatCard
          title="Active Candidates"
          value={stats.totalCandidates}
          icon={UserCheck}
          color="bg-purple-500"
        />
        <StatCard
          title="Voter Turnout"
          value={`${stats.totalVoters > 0 ? Math.round((stats.totalVotes / stats.totalVoters) * 100) : 0}%`}
          icon={BarChart3}
          color="bg-yellow-500"
        />
        <StatCard
          title="Blockchain Status"
          value={stats.votingActive ? "Active" : "Inactive"}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Blockchain Blocks"
          value={stats.blockchainBlocks}
          icon={Shield}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Results</h3>
          <div className="space-y-4">
            {state.candidates.slice(0, 5).map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{candidate.name}</p>
                    <p className="text-sm text-gray-500">{candidate.party}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {candidate.votes} votes
                  </span>
                  <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
                    {stats.totalVotes > 0 ? Math.round((candidate.votes / stats.totalVotes) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
            {state.candidates.length === 0 && (
              <p className="text-gray-500 text-center py-8">No candidates available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {state.auditTrail.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              state.auditTrail.slice(-5).map((event) => (
              <div key={event.id} className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{event.action}</p>
                  <p className="text-xs text-gray-500">
                    By {event.actor} • {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}