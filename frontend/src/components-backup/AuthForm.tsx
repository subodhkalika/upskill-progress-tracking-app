import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';

interface AuthFormProps {
  type: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = await apiClient.post(`/auth/${type}`, { email, password });

      if (type === 'login') {
        login(data.accessToken, data.user || { 
          id: 'some_id', 
          email: email, 
          createdAt: new Date().toISOString() 
        });
        setMessage('Success!');
      } else {
        setMessage('Registration successful! Please log in.');
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || `An error occurred during ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-800 to-secondary-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-200">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 shadow-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
            message.includes('Success') || message.includes('successful') 
              ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
              : 'bg-red-500/20 text-red-200 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 text-center text-gray-300">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="text-primary-300 hover:text-primary-200 font-medium underline"
                onClick={() => (window.location.hash = '#register')}
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary-300 hover:text-primary-200 font-medium underline"
                onClick={() => (window.location.hash = '#login')}
              >
                Sign in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
