import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';

// Main App Component (Root of the application)
function AppContent() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>(() => {
    // Determine initial page based on whether a token exists
    return localStorage.getItem('accessToken') ? 'dashboard' : 'login';
  });

  // Use hash-based routing for simple navigation between auth forms
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#register') {
        setCurrentPage('register');
      } else if (hash === '#login') {
        setCurrentPage('login');
      } else {
        // If logged in, always go to dashboard, otherwise default to login
        setCurrentPage(localStorage.getItem('accessToken') ? 'dashboard' : 'login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Call on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { accessToken } = useAuth(); // Access accessToken from context

  return (
    <>
      {accessToken ? (
        <Dashboard />
      ) : (
        currentPage === 'login' ? <AuthForm type="login" /> : <AuthForm type="register" />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
