import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { cn } from './ui/utils';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Desktop Top Bar - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <TopBar isCollapsed={sidebarCollapsed} onLogout={logout} />
      </div>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen transition-all duration-300",
        // Mobile/Tablet: full width, bottom padding for navigation
        "pb-20 lg:pb-0",
        // Desktop: account for sidebar and top bar
        "lg:pt-16",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <div className={cn(
          "mx-auto",
          // Mobile/Tablet: no max width constraint
          "lg:max-w-7xl"
        )}>
          <Outlet />
        </div>
      </main>

      {/* Mobile/Tablet Bottom Navigation - Hidden on desktop */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};
