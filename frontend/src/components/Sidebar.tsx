import { 
  Home, 
  Map, 
  CheckSquare, 
  Library, 
  BarChart3, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Dashboard', path: '/' },
    { id: 'roadmaps', icon: Map, label: 'Roadmaps', path: '/roadmaps' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { id: 'library', icon: Library, label: 'Library', path: '/library' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LM</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">LearnMaster</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center w-full h-10 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm font-medium",
                  isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            Version 1.0.0
          </div>
        </div>
      )}
    </div>
  );
}