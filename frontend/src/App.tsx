import { useState, useEffect } from 'react';
import { VotingProvider} from './contexts/BlockchainContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { VoterRegistration } from './components/VoterRegistration';
import { VoteCasting } from './components/VoteCasting';
import { Results } from './components/Results';
import { AuditTrail } from './components/AuditTrail';
import { User } from './types/blockchain';
import { useVoting } from './contexts/useVoting';

function AppContent() {
  const { dispatch } = useVoting();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Simulate user login
    const mockUser: User = {
      id: '1',
      name: 'Election Observer',
      role: 'observer',
      email: 'observer@voting.com'
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
  }, [dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'register':
        return <VoterRegistration />;
      case 'vote':
        return <VoteCasting />;
      case 'results':
        return <Results />;
      case 'audit':
        return <AuditTrail />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="w-64 min-h-screen">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <VotingProvider>
      <AppContent />
    </VotingProvider>
  );
}

export default App;