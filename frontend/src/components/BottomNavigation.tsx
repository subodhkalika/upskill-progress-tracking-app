import { 
  Home, 
  Map, 
  CheckSquare, 
  Library, 
  BarChart3, 
  User 
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'roadmaps', icon: Map, label: 'Roadmaps' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50 safe-area-pb">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[60px] min-h-[60px] transition-colors touch-manipulation ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}