import React, { useState } from 'react';
import { Blocks, Hash, Clock, Vote, ChevronDown, ChevronUp } from 'lucide-react';
import { BlockchainService } from '../services/BlockchainService';
import { Block } from '../types/voting';

interface BlockchainExplorerProps {
  blockchainService: BlockchainService;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({ blockchainService }) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());
  
  const systemState = blockchainService.getSystemState();
  const blockchain = systemState.blockchain;

  const toggleBlock = (index: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBlocks(newExpanded);
  };

  const formatHash = (hash: string) => {
    if (!hash) return 'N/A';
    return hash.length > 16 ? `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}` : hash;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-100 p-3 rounded-full mr-4">
          <Blocks className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blockchain Explorer</h2>
          <p className="text-gray-600">Explore the voting blockchain structure</p>
        </div>
      </div>

      <div className="mb-4 bg-indigo-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-indigo-600">Total Blocks</p>
            <p className="text-2xl font-bold text-indigo-900">{blockchain.length}</p>
          </div>
          <div>
            <p className="text-sm text-indigo-600">Total Votes</p>
            <p className="text-2xl font-bold text-indigo-900">
              {blockchain.slice(1).reduce((total, block) => total + block.Votes.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-indigo-600">Chain Status</p>
            <p className="text-2xl font-bold text-green-600">Valid</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {blockchain.map((block: Block, index: number) => {
          const isExpanded = expandedBlocks.has(index);
          const isGenesis = index === 0;
          
          return (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div
                className={`p-4 cursor-pointer transition-colors ${
                  isGenesis ? 'bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                }`}
                onClick={() => toggleBlock(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isGenesis ? 'bg-gray-200' : 'bg-blue-200'
                    }`}>
                      <span className="text-sm font-bold">
                        {isGenesis ? 'G' : index}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {isGenesis ? 'Genesis Block' : `Block ${index}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {block.Votes.length} vote{block.Votes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <p className="text-gray-600">Hash</p>
                      <p className="font-mono text-gray-900">
                        {formatHash(block.CurrentHash)}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Hash className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Previous Hash</span>
                      </div>
                      <p className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {block.PrevHash || 'N/A (Genesis Block)'}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Hash className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Current Hash</span>
                      </div>
                      <p className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {block.CurrentHash || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {block.Votes.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <Vote className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Votes in Block</span>
                      </div>
                      <div className="space-y-2">
                        {block.Votes.map((vote, voteIndex) => (
                          <div key={voteIndex} className="bg-gray-50 rounded p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  Voter ID: {vote.VoterID}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Voted for: </span>
                                <span className="text-sm font-medium text-blue-600">
                                  {vote.Candidate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.Votes.length === 0 && !isGenesis && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No votes in this block</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};