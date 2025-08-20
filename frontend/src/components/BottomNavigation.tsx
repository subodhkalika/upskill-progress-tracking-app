import { 
  Home, 
  Map, 
  CheckSquare, 
  Library, 
  BarChart3, 
  User 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function BottomNavigation() {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'roadmaps', icon: Map, label: 'Roadmaps', path: '/roadmaps' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { id: 'library', icon: Library, label: 'Library', path: '/library' },
    { id: 'analytics', icon: BarChart3, label: 'Stats', path: '/analytics' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50 safe-area-pb">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-3 rounded-lg min-w-[60px] min-h-[60px] transition-colors touch-manipulation ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}