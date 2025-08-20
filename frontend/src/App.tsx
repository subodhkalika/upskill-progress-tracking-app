import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomNavigation } from './components/BottomNavigation';

import { Dashboard } from './components/Dashboard';
import { Roadmaps } from './components/Roadmaps';
import { TaskManager } from './components/TaskManager';
import { ResourceLibrary } from './components/ResourceLibrary';
import { Analytics } from './components/Analytics';
import { Profile } from './components/Profile';
import { cn } from './components/ui/utils';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
    setSidebarCollapsed(false);
  };

  // Show authentication screens when not logged in
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView('signup')}
        />
      );
    } else {
      return (
        <Signup 
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  // Main application when authenticated
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'roadmaps':
        return <Roadmaps />;
      case 'tasks':
        return <TaskManager />;
      case 'library':
        return <ResourceLibrary />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Desktop Top Bar - Hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <TopBar isCollapsed={sidebarCollapsed} onLogout={handleLogout} />
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
          {renderActiveScreen()}
        </div>
      </main>

      {/* Mobile/Tablet Bottom Navigation - Hidden on desktop */}
      <div className="lg:hidden">
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}