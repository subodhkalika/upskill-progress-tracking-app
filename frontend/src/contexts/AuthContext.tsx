import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../services/api';

interface User {
  id: string;
  email: string;
  progress: any;
  settings: any;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  const login = async (data: any) => {
    const response = await loginUser(data);
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setIsAuthenticated(true);
    setUser(response.user);
  };

  const signup = async (data: any) => {
    await signupUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};