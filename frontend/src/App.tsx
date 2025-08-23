import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { Roadmaps } from './components/Roadmaps';
import { Milestones } from './components/Milestones';
import { TaskManager } from './components/TaskManager';
import { ResourceLibrary } from './components/ResourceLibrary';
import { Analytics } from './components/Analytics';
import { Profile } from './components/Profile';

// Component to redirect authenticated users away from auth pages
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes - redirect to dashboard if already authenticated */}
          <Route path="/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path="/signup" element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          } />
          
          {/* Protected routes - require authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="roadmaps/:roadmapId/milestones" element={<Milestones />} />
            <Route path="tasks" element={<TaskManager />} />
            <Route path="library" element={<ResourceLibrary />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
