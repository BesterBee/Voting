export interface VotingBlock {
  id: string;
  timestamp: number;
  previousHash: string;
  hash: string;
  data: VoteData[];
  nonce: number;
}

export interface VoteData {
  voterId: number;
  candidateId: string;
  timestamp: number;
  transactionId: string;
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  hasVoted: boolean;
  registeredAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  description?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  action: string;
  actor: string;
  details: string;
  blockHash: string;
}

export interface User {
  id: string;
  name: string;
  role: 'voter' | 'admin' | 'observer';
  email: string;
}

export interface VotingStats {
  totalVoters: number;
  totalVotes: number;
  totalCandidates: number;
  blockchainBlocks: number;
  votingActive: boolean;
}
export interface BlockchainResponse {
  blocks: VotingBlock[];
  voters: Voter[];
  candidates: Candidate[];
  auditEvents: AuditEvent[];
  stats: VotingStats;
}