import React, { useState } from 'react';
import { UserPlus, Key, Shield, CheckCircle } from 'lucide-react';
import { VotingService } from '../services/VotingService';
import { Voter } from '../types/voting';

interface VoterRegistrationProps {
  votingService: VotingService;
  onVoterRegistered: (voter: Voter) => void;
}

export const VoterRegistration: React.FC<VoterRegistrationProps> = ({
  votingService,
  onVoterRegistered
}) => {
  const [voterId, setVoterId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!voterId.trim()) {
      setError('Please enter a voter ID');
      return;
    }

    setIsRegistering(true);
    setError('');
    setSuccess(false);

    try {
      const voter = votingService.registerVoter(voterId.trim());
      onVoterRegistered(voter);
      setSuccess(true);
      setVoterId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Voter Registration</h2>
        <p className="text-gray-600">Register to participate in secure blockchain voting</p>
      </div>

      {success ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful!</h3>
          <p className="text-green-600">Your cryptographic keys have been generated</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-2">
              Voter ID
            </label>
            <input
              id="voterId"
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              placeholder="Enter your unique voter ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isRegistering}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium"
          >
            {isRegistering ? 'Registering...' : 'Register Voter'}
          </button>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Security Features</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Cryptographic key pair generation
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Blockchain-based vote verification
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Double-voting prevention
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};