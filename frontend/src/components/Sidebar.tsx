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
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'roadmaps', icon: Map, label: 'Roadmaps' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: User, label: 'Profile' },
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
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start h-10 hover:bg-sidebar-accent transition-colors",
                  isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
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