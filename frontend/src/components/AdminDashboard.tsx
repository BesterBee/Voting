import React, { useState, useEffect } from 'react';
import { Plus, Users, BarChart3, Shield, Activity, FileText, Trash2 } from 'lucide-react';
import { VotingService } from '../services/VotingService';
import { Ballot, VotingResults } from '../types/voting';

interface AdminDashboardProps {
  votingService: VotingService;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ votingService }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [results, setResults] = useState<Map<string, VotingResults>>(new Map());

  // Ballot creation form
  const [newBallot, setNewBallot] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  useEffect(() => {
    refreshData();
  }, [votingService]);

  const refreshData = () => {
    setBallots(votingService.getAllBallots());
    setStats(votingService.getSystemStats());
    
    // Load results for all ballots
    const resultsMap = new Map<string, VotingResults>();
    votingService.getAllBallots().forEach(ballot => {
      try {
        const ballotResults = votingService.getVotingResults(ballot.id);
        resultsMap.set(ballot.id, ballotResults);
      } catch (error) {
        console.error('Error loading results for ballot:', ballot.id, error);
      }
    });
    setResults(resultsMap);
  };

  const handleCreateBallot = () => {
    if (!newBallot.title.trim() || !newBallot.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const validOptions = newBallot.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    try {
      votingService.createBallot(newBallot.title, newBallot.description, validOptions);
      setNewBallot({ title: '', description: '', options: ['', ''] });
      refreshData();
    } catch (error) {
      alert('Error creating ballot: ' + error);
    }
  };

  const handleDeactivateBallot = (ballotId: string) => {
    if (confirm('Are you sure you want to deactivate this ballot?')) {
      votingService.deactivateBallot(ballotId);
      refreshData();
    }
  };

  const addOption = () => {
    setNewBallot({ ...newBallot, options: [...newBallot.options, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newBallot.options];
    newOptions[index] = value;
    setNewBallot({ ...newBallot, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (newBallot.options.length > 2) {
      const newOptions = newBallot.options.filter((_, i) => i !== index);
      setNewBallot({ ...newBallot, options: newOptions });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ballots', label: 'Ballots', icon: FileText },
    { id: 'results', label: 'Results', icon: Activity },
    { id: 'create', label: 'Create Ballot', icon: Plus }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage the blockchain voting system</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600">Total Voters</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalVoters}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Total Ballots</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalBallots}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Activity className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-600">Active Ballots</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.activeBallots}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-orange-600">Total Votes</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.totalVotes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Blockchain Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Chain Length</p>
                    <p className="font-bold">{stats.blockchainInfo.length} blocks</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Chain Validity</p>
                    <p className={`font-bold ${stats.blockchainInfo.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.blockchainInfo.isValid ? 'Valid' : 'Invalid'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Latest Block</p>
                    <p className="font-bold">#{stats.blockchainInfo.latestBlock.index}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ballots' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">All Ballots</h3>
              <div className="space-y-3">
                {ballots.map((ballot) => (
                  <div key={ballot.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{ballot.title}</h4>
                        <p className="text-gray-600 text-sm">{ballot.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{ballot.options.length} options</span>
                          <span>Created: {new Date(ballot.createdAt).toLocaleDateString()}</span>
                          <span className={`font-medium ${ballot.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {ballot.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      {ballot.isActive && (
                        <button
                          onClick={() => handleDeactivateBallot(ballot.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Voting Results</h3>
              {ballots.map((ballot) => {
                const ballotResults = results.get(ballot.id);
                if (!ballotResults) return null;

                return (
                  <div key={ballot.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{ballot.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Total Votes: {ballotResults.totalVotes}
                    </p>
                    <div className="space-y-2">
                      {ballotResults.results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{result.option}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${result.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium min-w-16 text-right">
                              {result.count} ({result.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Ballot</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ballot Title
                  </label>
                  <input
                    type="text"
                    value={newBallot.title}
                    onChange={(e) => setNewBallot({ ...newBallot, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ballot title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newBallot.description}
                    onChange={(e) => setNewBallot({ ...newBallot, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter ballot description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  {newBallot.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {newBallot.options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Option
                  </button>
                </div>
                
                <button
                  onClick={handleCreateBallot}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Create Ballot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};