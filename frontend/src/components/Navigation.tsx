import { 
  LayoutDashboard, 
  UserPlus, 
  Vote, 
  Eye, 
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'register', label: 'Register Voter', icon: UserPlus, path: '/register' },
    { id: 'vote', label: 'Cast Vote', icon: Vote, path: '/vote' },
    { id: 'results', label: 'Results', icon: BarChart3, path: '/results' },
    { id: 'audit', label: 'Audit Trail', icon: Eye, path: '/audit' },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200">
      <div className="px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}