import { Voter, Ballot, Vote, VotingResults } from '../types/voting';
import { CryptoUtils } from '../utils/crypto';
import { Blockchain } from '../utils/blockchain';

export class VotingService {
  private voters: Map<string, Voter> = new Map();
  private ballots: Map<string, Ballot> = new Map();
  private blockchain: Blockchain = new Blockchain();
  private adminKey = 'admin-private-key-demo';

  // Voter Registration
  registerVoter(voterId: string): Voter {
    if (this.voters.has(voterId)) {
      throw new Error('Voter already registered');
    }

    const keyPair = CryptoUtils.generateKeyPair();
    const voter: Voter = {
      id: voterId,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      hasVoted: false,
      registrationTime: Date.now(),
      name: "",
      email: "",
    };

    this.voters.set(voterId, voter);
    return voter;
  }

  getVoter(voterId: string): Voter | undefined {
    return this.voters.get(voterId);
  }

  getAllVoters(): Voter[] {
    return Array.from(this.voters.values());
  }

  // Ballot Management
  createBallot(title: string, description: string, options: string[]): Ballot {
    const ballot: Omit<Ballot, 'signature'> = {
      id: CryptoUtils.generateRandomString(16),
      title,
      description,
      options,
      creatorPublicKey: this.adminKey,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      isActive: true
    };

    const signature = CryptoUtils.signBallot(ballot, this.adminKey);
    const signedBallot: Ballot = { ...ballot, signature };

    this.ballots.set(signedBallot.id, signedBallot);
    return signedBallot;
  }

  getBallot(ballotId: string): Ballot | undefined {
    return this.ballots.get(ballotId);
  }

  getAllBallots(): Ballot[] {
    return Array.from(this.ballots.values());
  }

  getActiveBallots(): Ballot[] {
    return this.getAllBallots().filter(ballot => ballot.isActive);
  }

  deactivateBallot(ballotId: string): boolean {
    const ballot = this.ballots.get(ballotId);
    if (ballot) {
      ballot.isActive = false;
      return true;
    }
    return false;
  }

  // Voting
  castVote(voterId: string, ballotId: string, selectedOption: number): boolean {
    const voter = this.voters.get(voterId);
    const ballot = this.ballots.get(ballotId);

    if (!voter || !ballot) {
      throw new Error('Invalid voter or ballot');
    }

    if (!ballot.isActive) {
      throw new Error('Ballot is not active');
    }

    if (selectedOption < 0 || selectedOption >= ballot.options.length) {
      throw new Error('Invalid option selected');
    }

    // Check if voter has already voted for this ballot
    const existingVotes = this.blockchain.getVotesForBallot(ballotId);
    if (existingVotes.some(vote => vote.voterPublicKey === voter.publicKey)) {
      throw new Error('Voter has already voted for this ballot');
    }

    const vote: Omit<Vote, 'signature'> = {
      id: CryptoUtils.generateRandomString(16),
      ballotId,
      voterPublicKey: voter.publicKey,
      selectedOption,
      timestamp: Date.now()
    };

    const signature = CryptoUtils.signVote(vote, voter.privateKey);
    const signedVote: Vote = { ...vote, signature };

    // Verify the vote signature
    if (!CryptoUtils.verifyVote(signedVote, voter.publicKey)) {
      throw new Error('Vote signature verification failed');
    }

    // Add vote to blockchain
    const success = this.blockchain.addVote(signedVote);
    if (!success) {
      throw new Error('Failed to add vote to blockchain');
    }

    voter.hasVoted = true;
    return true;
  }

  // Results and Analytics
  getVotingResults(ballotId: string): VotingResults {
    const ballot = this.ballots.get(ballotId);
    if (!ballot) {
      throw new Error('Ballot not found');
    }

    const votes = this.blockchain.getVotesForBallot(ballotId);
    const totalVotes = votes.length;
    const optionCounts: number[] = new Array(ballot.options.length).fill(0);

    votes.forEach(vote => {
      if (vote.selectedOption >= 0 && vote.selectedOption < ballot.options.length) {
        optionCounts[vote.selectedOption]++;
      }
    });

    const results = ballot.options.map((option, index) => ({
      option,
      count: optionCounts[index],
      percentage: totalVotes > 0 ? (optionCounts[index] / totalVotes) * 100 : 0
    }));

    return {
      ballotId,
      totalVotes,
      results
    };
  }

  getBlockchainInfo() {
    return this.blockchain.getChainInfo();
  }

  // Admin functions
  getSystemStats() {
    return {
      totalVoters: this.voters.size,
      totalBallots: this.ballots.size,
      activeBallots: this.getActiveBallots().length,
      totalVotes: this.blockchain.getAllVotes().length,
      blockchainInfo: this.getBlockchainInfo()
    };
  }
}