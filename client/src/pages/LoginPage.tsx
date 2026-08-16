import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Shield, Lock, ArrowRight, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'ADMIN' | 'ANALYST' | 'USER') => {
    setLoading(true);
    try {
      const ok = await switchDemoAccount(role);
      if (ok) {
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'ANALYST') navigate('/dashboard');
        else navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 mx-auto flex items-center justify-center border border-red-500/50 shadow-glow-red">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Sign In to Sentinel</h1>
            <p className="text-xs text-gray-400 font-mono">
              Access behavioral fraud command center & session triage.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="cyber-card p-6 rounded-2xl border-[#1E2631] space-y-4 font-mono text-xs shadow-2xl">
            <div className="space-y-1">
              <label className="text-gray-300 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@sentinel.demo"
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo One-Click Fill */}
          <div className="cyber-card p-4 rounded-xl border-[#1E2631] space-y-2 font-mono text-xs">
            <span className="text-[10px] text-amber-400 font-semibold block uppercase">
              ⚡ Quick Demo Account Sign-In
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="py-2 px-2 bg-red-950/80 border border-red-800/60 hover:bg-red-900 text-red-300 rounded font-semibold text-[11px] transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ANALYST')}
                className="py-2 px-2 bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900 text-emerald-300 rounded font-semibold text-[11px] transition-colors"
              >
                Analyst
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('USER')}
                className="py-2 px-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 rounded font-semibold text-[11px] transition-colors"
              >
                User
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 font-mono">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
