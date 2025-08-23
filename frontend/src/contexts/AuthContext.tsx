import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import type { User } from '../types'; // Assuming you have a User type defined

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await apiClient.get('/api/auth/profile');
          setUser(userData.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const userData = await apiClient.get('/api/auth/profile');
        setUser(userData.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch user profile on login', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    // You might want to render a loading spinner here
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
