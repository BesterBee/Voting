import React, { createContext, useReducer, ReactNode } from 'react';
import { VotingBlock, VoteData, AuditEvent, User, Candidate, Voter } from '../types/blockchain';
import { apiService } from '../services/api';
import { useCallback } from 'react';

interface VotingState {
  blockchain: VotingBlock[];
  auditTrail: AuditEvent[];
  currentUser: User | null;
  candidates: Candidate[];
  voters: Voter[];
  votes: VoteData[];
  isLoading: boolean;
  error: string | null;
}

type VotingAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_CANDIDATES'; payload: Candidate[] }
  | { type: 'SET_VOTERS'; payload: Voter[] }
  | { type: 'ADD_VOTE'; payload: VoteData }
  | { type: 'REGISTER_VOTER'; payload: Voter }
  | { type: 'ADD_AUDIT_EVENT'; payload: AuditEvent }
  | { type: 'SET_BLOCKCHAIN'; payload: VotingBlock[] };

const initialState: VotingState = {
  blockchain: [],
  auditTrail: [],
  currentUser: null,
  candidates: [],
  voters: [],
  votes: [],
  isLoading: false,
  error: null
};

export const VotingContext = createContext<{
  state: VotingState;
  dispatch: React.Dispatch<VotingAction>;
  loadCandidates: () => Promise<void>;
  loadBlockchain: () => Promise<void>;
  registerVoter: (name: string, email: string, nationalId: string) => Promise<void>;
  castVote: (voterId: string, candidateId: string) => Promise<void>;
} | null>(null);

function votingReducer(state: VotingState, action: VotingAction): VotingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload };
    case 'SET_VOTERS':
      return { ...state, voters: action.payload };
    case 'ADD_VOTE':
      return { ...state, votes: [...state.votes, action.payload] };
    case 'REGISTER_VOTER':
      return {
        ...state,
        voters: [...state.voters, action.payload]
      };
    case 'ADD_AUDIT_EVENT':
      return { ...state, auditTrail: [...state.auditTrail, action.payload] };
    case 'SET_BLOCKCHAIN':
      return { ...state, blockchain: action.payload };
    default:
      return state;
  }
}

export function VotingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(votingReducer, initialState);

  const loadCandidates = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const candidates = await apiService.getCandidates();
      dispatch({ type: 'SET_CANDIDATES', payload: candidates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load candidates' });
      console.error('Error loading candidates:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  } , []);

const loadBlockchain = useCallback(async () => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const blockchainData = await apiService.getBlockchain();

    const mappedBlocks: VotingBlock[] = blockchainData.blocks.map((block, index) => ({
      id: `block-${index}`,
      previousHash: block.previousHash,
      hash: block.hash,
      data: block.data,
      nonce: block.nonce,
      timestamp: new Date(block.timestamp).getTime()
    }));

    dispatch({ type: 'SET_BLOCKCHAIN', payload: mappedBlocks });

  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: 'Failed to load blockchain data' });
    console.error('Error loading blockchain:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, []);


  const registerVoter = async (name: string, email: string, nationalId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await apiService.registerVoter({ name, email, nationalId });
      
      const newVoter: Voter = {
        id: response.voterId || Math.random().toString(36).substring(7),
        name,
        email,
        nationalId,
        hasVoted: false,
        registeredAt: Date.now()
      };
      
      dispatch({ type: 'REGISTER_VOTER', payload: newVoter });
      dispatch({ 
        type: 'ADD_AUDIT_EVENT', 
        payload: {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          action: `Voter registered: ${name}`,
          actor: 'System',
          details: `New voter registered with ID: ${newVoter.id}`,
          blockHash: response.blockHash || 'pending'
        }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to register voter' });
      console.error('Error registering voter:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const castVote = async (voterId: string, candidateId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await apiService.castVote({ voterId, candidateId });
      
      const voteData: VoteData = {
        voterId,
        candidateId,
        timestamp: Date.now(),
        transactionId: response.transactionId || Math.random().toString(36).substring(7)
      };
      
      dispatch({ type: 'ADD_VOTE', payload: voteData });
      dispatch({ 
        type: 'ADD_AUDIT_EVENT', 
        payload: {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          action: `Vote cast by voter ${voterId}`,
          actor: `Voter ${voterId}`,
          details: `Vote cast for candidate ${candidateId}`,
          blockHash: response.blockHash || 'pending'
        }
      });
      
      // Refresh candidates to get updated vote counts
      await loadCandidates();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to cast vote' });
      console.error('Error casting vote:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <VotingContext.Provider value={{ 
      state, 
      dispatch, 
      loadCandidates, 
      loadBlockchain, 
      registerVoter, 
      castVote 
    }}>
      {children}
    </VotingContext.Provider>
  );
}
