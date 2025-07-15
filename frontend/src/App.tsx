import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VotingProvider } from './contexts/BlockchainContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { VoterRegistration } from './components/VoterRegistration';
import { VoteCasting } from './components/VoteCasting';
import { Results } from './components/Results';
import { AuditTrail } from './components/AuditTrail';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="w-64 min-h-screen">
          <Navigation />
        </div>
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<VoterRegistration />} />
            <Route path="/vote" element={<VoteCasting />} />
            <Route path="/results" element={<Results />} />
            <Route path="/audit" element={<AuditTrail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <VotingProvider>
      <Router>
        <AppContent />
      </Router>
    </VotingProvider>
  );
}

export default App;