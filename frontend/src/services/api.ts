import axios from 'axios';
import { BlockchainResponse } from '../types/blockchain';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface RegisterVoterRequest {
  name: string;
  email: string;
  nationalId: string;
}

export interface CastVoteRequest {
  voterId: string;
  candidateId: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
}



export const apiService = {
  // Register a new voter
  registerVoter: async (data: RegisterVoterRequest) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  // Cast a vote
  castVote: async (data: CastVoteRequest) => {
    const response = await api.post('/vote', data);
    return response.data;
  },

  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get blockchain data
  getBlockchain: async (): Promise<BlockchainResponse> => {
    const response = await api.get('/blockchain');
    return response.data;
  },
};

export default api;