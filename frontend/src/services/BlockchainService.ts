import { Vote, Block, ElectionResults, VotingSystemState } from '../types/voting';

export class BlockchainService {
  private blockchain: Block[] = [];
  private candidates: Record<string, number> = {};
  private voterReg: Record<number, boolean> = {};

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem() {
    // Create genesis block
    const genesisBlock: Block = {
      PrevHash: "",
      CurrentHash: "",
      Votes: []
    };
    this.blockchain = [genesisBlock];

    // Initialize candidates (matching Go backend)
    this.candidates = {
      "Alice": 0,
      "Bob": 0,
      "Charlie": 0,
      "David": 0
    };

    // Register initial voters (1-10)
    for (let i = 1; i <= 10; i++) {
      this.registerVoter(i);
    }
  }

  private calculateHash(block: Block, vote: Vote): string {
    // Simplified hash calculation to match Go logic
    const data = `${JSON.stringify(block)}${JSON.stringify(vote)}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  registerVoter(voterID: number): { success: boolean; message: string } {
    if (this.voterReg[voterID]) {
      return {
        success: false,
        message: `Voter ${voterID} is already registered.`
      };
    }

    this.voterReg[voterID] = true;
    return {
      success: true,
      message: `Voter ${voterID} registered.`
    };
  }

  castVote(voterID: number, candidate: string): { success: boolean; message: string } {
    // Check if voter is registered
    if (!this.voterReg[voterID]) {
      return {
        success: false,
        message: `Voter with ID ${voterID} is not registered.`
      };
    }

    // Check if candidate exists
    if (!(candidate in this.candidates)) {
      return {
        success: false,
        message: `Candidate ${candidate} does not exist.`
      };
    }

    // Check if voter has already voted
    for (let i = 0; i < this.blockchain.length; i++) {
      for (let j = 0; j < this.blockchain[i].Votes.length; j++) {
        if (this.blockchain[i].Votes[j].VoterID === voterID) {
          return {
            success: false,
            message: `Voter ${voterID} has already voted.`
          };
        }
      }
    }

    // Create vote and new block
    const vote: Vote = { VoterID: voterID, Candidate: candidate };
    const lastBlock = this.blockchain[this.blockchain.length - 1];
    const newBlock: Block = {
      PrevHash: lastBlock.CurrentHash,
      CurrentHash: "",
      Votes: [vote]
    };
    newBlock.CurrentHash = this.calculateHash(newBlock, vote);
    
    this.blockchain.push(newBlock);
    this.candidates[candidate]++;

    return {
      success: true,
      message: `Voter ${voterID} has successfully voted for ${candidate}.`
    };
  }

  calculateElectionResults(): ElectionResults {
    let winner = "";
    let maxVotes = -1;
    let isTie = false;

    for (const [candidate, votes] of Object.entries(this.candidates)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = candidate;
        isTie = false;
      } else if (votes === maxVotes && maxVotes > 0) {
        isTie = true;
      }
    }

    if (isTie) {
      winner = "It's a tie!";
    }

    return {
      candidates: { ...this.candidates },
      winner,
      maxVotes,
      isTie
    };
  }

  getSystemState(): VotingSystemState {
    return {
      blockchain: [...this.blockchain],
      candidates: { ...this.candidates },
      voterReg: { ...this.voterReg }
    };
  }

  getRegisteredVoters(): number[] {
    return Object.keys(this.voterReg)
      .filter(id => this.voterReg[parseInt(id)])
      .map(id => parseInt(id))
      .sort((a, b) => a - b);
  }

  getTotalVotes(): number {
    return this.blockchain.slice(1).reduce((total, block) => total + block.Votes.length, 0);
  }

  hasVoterVoted(voterID: number): boolean {
    for (const block of this.blockchain) {
      for (const vote of block.Votes) {
        if (vote.VoterID === voterID) {
          return true;
        }
      }
    }
    return false;
  }
}