import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import { VoterInterface } from './components/VoterInterface';
import { ElectionResults } from './components/ElectionResults';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { BlockchainService } from './services/BlockchainService';

function App() {
  const [blockchainService] = useState(() => new BlockchainService());
  const [activeTab, setActiveTab] = useState<'vote' | 'results' | 'blockchain'>('vote');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVoteUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'vote' as const, label: 'Cast Vote', icon: '🗳️' },
    { id: 'results' as const, label: 'Results', icon: '📊' },
    { id: 'blockchain' as const, label: 'Blockchain', icon: '⛓️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <span className="text-xl font-bold text-gray-900">GoChain Vote</span>
                <span className="text-sm text-gray-500 ml-2">Blockchain Voting System</span>
              </div>
            </div>
            
            <button
              onClick={handleVoteUpdate}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blockchain Voting System
          </h1>
          <p className="text-gray-600">
            Secure, transparent, and decentralized voting powered by blockchain technology
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div key={refreshKey}>
          {activeTab === 'vote' && (
            <VoterInterface
              blockchainService={blockchainService}
              onVoteUpdate={handleVoteUpdate}
            />
          )}
          
          {activeTab === 'results' && (
            <ElectionResults blockchainService={blockchainService} />
          )}
          
          {activeTab === 'blockchain' && (
            <BlockchainExplorer blockchainService={blockchainService} />
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">
                {blockchainService.getRegisteredVoters().length}
              </div>
              <div className="text-sm text-blue-600">Registered Voters</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">
                {blockchainService.getTotalVotes()}
              </div>
              <div className="text-sm text-green-600">Total Votes Cast</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-900">
                {Object.keys(blockchainService.getSystemState().candidates).length}
              </div>
              <div className="text-sm text-purple-600">Candidates</div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-900">
                {blockchainService.getSystemState().blockchain.length}
              </div>
              <div className="text-sm text-indigo-600">Blockchain Blocks</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Voter Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Double-Vote Prevention</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Blockchain Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Real-time Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;