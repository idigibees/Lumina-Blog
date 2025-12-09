import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('admin@lumina.com'); // Default for easy testing
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = StorageService.login(email);
    if (user) {
      setUser(user);
      navigate('/');
    } else {
      setError('User not found. Try "admin@lumina.com" or "sarah@writer.com"');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
           <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">L</div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to Lumina</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or use a demo account to explore
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (any)"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="mt-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 text-center">Demo Credentials</h4>
            <div className="text-xs text-gray-600 text-center space-y-1">
                <p>Admin: <span className="font-mono text-indigo-600">admin@lumina.com</span></p>
                <p>Author: <span className="font-mono text-indigo-600">sarah@writer.com</span></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;