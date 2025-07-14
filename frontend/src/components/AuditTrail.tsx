import { useState } from 'react';
import { Eye, User, Shield, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { useVoting } from '../contexts/useVoting';

export function AuditTrail() {
  const { state } = useVoting();
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const toggleBlockExpansion = (blockId: string) => {
    setExpandedBlock(expandedBlock === blockId ? null : blockId);
  };

  const getBlockColor = (index: number) => {
    if (index === 0) return 'bg-green-100 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">
            Chain Integrity: {state.blockchain.length > 0 ? 'Valid' : 'Empty'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Visualization</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-4">
              {state.blockchain.map((block, index) => (
                <div key={block.id} className="relative">
                  <div className={`border-2 rounded-lg p-4 ${getBlockColor(index)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{block.id}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Block #{block.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(block.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBlockExpansion(block.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedBlock === block.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {expandedBlock === block.id && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">Hash</p>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                              {block.hash}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Previous Hash</p>
                            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                              {block.previousHash}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Nonce</p>
                            <p className="font-mono text-sm">{block.nonce}</p>
                          </div>
                          {block.data.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600">Vote Data</p>
                              {block.data.map((vote, i) => (
                                <div key={i} className="bg-gray-100 p-2 rounded">
                                  <p className="text-sm"><strong>Voter ID:</strong> {vote.voterId}</p>
                                  <p className="text-sm"><strong>Candidate ID:</strong> {vote.candidateId}</p>
                                  <p className="text-sm"><strong>Transaction ID:</strong> {vote.transactionId}</p>
                                  <p className="text-sm"><strong>Timestamp:</strong> {new Date(vote.timestamp).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {index < state.blockchain.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-6 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-4">
              {state.auditTrail.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No audit events yet</p>
              ) : (
                state.auditTrail.slice().reverse().map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.action}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.actor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 font-mono">
                            {event.blockHash.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{state.blockchain.length}</p>
            <p className="text-sm text-gray-600">Total Blocks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{state.votes.length}</p>
            <p className="text-sm text-gray-600">Votes Cast</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{state.auditTrail.length}</p>
            <p className="text-sm text-gray-600">Audit Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {state.blockchain.length > 0 ? '100%' : '0%'}
            </p>
            <p className="text-sm text-gray-600">Chain Integrity</p>
          </div>
        </div>
      </div>
    </div>
  );
}