import React, { useState } from 'react';
import { Shield, Key, Users, CheckCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'voter' | 'admin', userId?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'voter' | 'admin' | null>(null);
  const [voterId, setVoterId] = useState('');

  const handleLogin = () => {
    if (selectedRole === 'voter') {
      if (!voterId.trim()) {
        alert('Please enter your voter ID');
        return;
      }
      onLogin('voter', voterId.trim());
    } else if (selectedRole === 'admin') {
      onLogin('admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BlockVote</h1>
          <p className="text-gray-600">Secure Blockchain Voting System</p>
        </div>

        <div className="space-y-4 mb-6">
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === 'voter' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('voter')}
          >
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Voter Login</h3>
                <p className="text-sm text-gray-600">Cast your vote securely</p>
              </div>
            </div>
          </div>

          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === 'admin' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <div className="flex items-center">
              <Key className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Admin Login</h3>
                <p className="text-sm text-gray-600">Manage ballots and system</p>
              </div>
            </div>
          </div>
        </div>

        {selectedRole === 'voter' && (
          <div className="mb-6">
            <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-2">
              Voter ID
            </label>
            <input
              id="voterId"
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              placeholder="Enter your voter ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!selectedRole || (selectedRole === 'voter' && !voterId.trim())}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium"
        >
          Login
        </button>

        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            System Features
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Cryptographic vote signing</li>
            <li>• Blockchain verification</li>
            <li>• Double-voting prevention</li>
            <li>• Real-time result tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};