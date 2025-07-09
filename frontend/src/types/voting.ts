export interface Vote {
  VoterID: number;
  Candidate: string;
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