import { 
  LayoutDashboard, 
  UserPlus, 
  Vote, 
  Eye, 
  BarChart3
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register Voter', icon: UserPlus },
    { id: 'vote', label: 'Cast Vote', icon: Vote },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'audit', label: 'Audit Trail', icon: Eye },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200">
      <div className="px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}