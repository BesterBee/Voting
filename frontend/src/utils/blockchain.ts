import { Block, Vote } from '../types/voting';
import { CryptoUtils } from './crypto';

export class Blockchain {
  private chain: Block[] = [];
  private difficulty = 2;

  constructor() {
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      votes: [],
      previousHash: '0',
      hash: '0',
      nonce: 0
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  private calculateHash(block: Block): string {
    return CryptoUtils.hash(
      block.index +
      block.timestamp +
      JSON.stringify(block.votes) +
      block.previousHash +
      block.nonce
    );
  }

  private mineBlock(block: Block): void {
    const target = '0'.repeat(this.difficulty);
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }
  }

  addVote(vote: Vote): boolean {
    // Check if vote already exists (prevent double voting)
    const existingVote = this.getAllVotes().find(v => 
      v.voterPublicKey === vote.voterPublicKey && v.ballotId === vote.ballotId
    );
    
    if (existingVote) {
      return false; // Double voting prevented
    }

    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      votes: [vote],
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0
    };

    this.mineBlock(newBlock);
    this.chain.push(newBlock);
    return true;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  getAllVotes(): Vote[] {
    return this.chain.flatMap(block => block.votes);
  }

  getVotesForBallot(ballotId: string): Vote[] {
    return this.getAllVotes().filter(vote => vote.ballotId === ballotId);
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChainInfo() {
    return {
      length: this.chain.length,
      isValid: this.isChainValid(),
      totalVotes: this.getAllVotes().length,
      latestBlock: this.getLatestBlock()
    };
  }
}