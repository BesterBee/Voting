import { Voter, Vote, Ballot } from '../types/voting';

// Simple cryptographic utilities for demonstration
export class CryptoUtils {
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const privateKey = this.generateRandomString(64);
    const publicKey = this.generateRandomString(64);
    return { publicKey, privateKey };
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static sign(data: string, privateKey: string): string {
    // Simplified signing - in production, use proper cryptographic signing
    return this.hash(data + privateKey);
  }

  static verify(data: string, signature: string, publicKey: string): boolean {
    // Simplified verification - in production, use proper cryptographic verification
    const expectedSignature = this.hash(data + publicKey);
    return signature === expectedSignature;
  }

  static hash(data: string): string {
    // Simple hash function - in production, use SHA-256
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  static signVote(vote: Omit<Vote, 'signature'>, privateKey: string): string {
    const voteData = `${vote.ballotId}${vote.voterPublicKey}${vote.selectedOption}${vote.timestamp}`;
    return this.sign(voteData, privateKey);
  }

  static verifyVote(vote: Vote, publicKey: string): boolean {
    const voteData = `${vote.ballotId}${vote.voterPublicKey}${vote.selectedOption}${vote.timestamp}`;
    return this.verify(voteData, vote.signature, publicKey);
  }

  static signBallot(ballot: Omit<Ballot, 'signature'>, adminKey: string): string {
    const ballotData = `${ballot.id}${ballot.title}${ballot.description}${ballot.options.join('')}${ballot.createdAt}`;
    return this.sign(ballotData, adminKey);
  }
}