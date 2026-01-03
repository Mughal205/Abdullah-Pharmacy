
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // Pre-filling 'admin' to streamline the "Admin login" process
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated authentication - using admin/1234 for demo
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === '1234') {
        onLogin(true);
      } else {
        setError('Invalid administrator credentials. Access denied.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all hover:shadow-blue-500/10">
        {/* Header Section */}
        <div className="p-10 text-center bg-slate-900 text-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-xl shadow-blue-500/40 rotate-3 hover:rotate-0 transition-transform cursor-default">
            <span className="text-5xl">🔐</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Login</h1>
          <p className="text-blue-400 font-medium text-sm mt-2 uppercase tracking-widest">Abdullah Pharmacy Portal</p>
        </div>
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl animate-bounce">
              <span className="font-bold">Security Alert:</span> {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Administrator ID</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">👤</span>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-slate-700 font-medium"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">🔑</span>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white text-slate-700 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transform transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Portal</span>
                <span className="text-xl">➜</span>
              </>
            )}
          </button>
          
          <div className="pt-4 text-center border-t border-slate-50">
            <p className="text-xs text-slate-400 flex flex-col gap-1">
              <span>Secure administrative access restricted to authorized personnel.</span>
              <span className="font-semibold text-slate-300">Default Auth: admin / 1234</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
