import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Shield, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ANALYST'>('USER');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await register(name, email, password, role);
      if (ok) {
        if (role === 'ANALYST') navigate('/dashboard');
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
            <h1 className="text-2xl font-bold text-white font-display">Create Sentinel Account</h1>
            <p className="text-xs text-gray-400 font-mono">
              Register for Sentinel Behavioral Fraud Intelligence Platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cyber-card p-6 rounded-2xl border-[#1E2631] space-y-4 font-mono text-xs shadow-2xl">
            <div className="space-y-1">
              <label className="text-gray-300 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Evelyn Vance"
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="evelyn@example.com"
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
                placeholder="At least 6 characters"
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 block">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-red-500"
              >
                <option value="USER">Public User (Scam Database & Reports)</option>
                <option value="ANALYST">Fraud Analyst (Session Triage & Case Review)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 transition-colors"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 font-mono">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
