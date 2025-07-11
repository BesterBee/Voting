export interface Vote {
  id: string;
  ballotId: string;
  voterPublicKey: string;
  selectedOption: number;
  timestamp: number;
  signature?: string; // Optional, since it's omitted in some places
}

export interface Block {
  PrevHash: string;
  CurrentHash: string;
  Votes: Vote[];
}

export interface ElectionResults {
  candidates: Record<string, number>;
  winner: string;
  maxVotes: number;
  isTie: boolean;
}

export interface VotingSystemState {
  blockchain: Block[];
  candidates: Record<string, number>;
  voterReg: Record<number, boolean>;
}
export interface Voter {
  id: string;
  publicKey: string;
  privateKey: string;
  hasVoted: boolean;
  registrationTime: number;
  name: string;
  email: string;
}

export interface VotingResults {
  ballotId: string;
  totalVotes: number;
  results: {
    option: string;
    count: number;
    percentage: number;
  }[];
}

export interface Ballot {
  id: string;
  title: string;
  description: string;
  options: string[];
  creatorPublicKey: string;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
  signature: string;  
}