import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Activity, Search, AlertOctagon, User, LogOut, Menu, X, ChevronDown, Cpu, Users, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAnalyst, isAdmin, logout, switchDemoAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleDemoSwitch = async (role: Role) => {
    setDemoMenuOpen(false);
    await switchDemoAccount(role);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'ANALYST') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-[#0B0D10]/95 border-b border-[#1E2631] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center border border-red-500/50 shadow-glow-red group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold tracking-widest text-lg text-white flex items-center gap-1.5">
                  SENTINEL
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                <span className="text-[9px] font-mono text-gray-400 tracking-tighter uppercase">
                  Behavioral Fraud Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-xs font-mono tracking-wide transition-colors ${
                  isActive('/') ? 'bg-[#111418] text-red-400 border border-red-500/30' : 'text-gray-300 hover:text-white hover:bg-[#111418]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/scams"
                className={`px-3 py-2 rounded-md text-xs font-mono tracking-wide transition-colors flex items-center gap-1.5 ${
                  isActive('/scams') ? 'bg-[#111418] text-red-400 border border-red-500/30' : 'text-gray-300 hover:text-white hover:bg-[#111418]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                Scam Database
              </Link>
              <Link
                to="/report"
                className={`px-3 py-2 rounded-md text-xs font-mono tracking-wide transition-colors flex items-center gap-1.5 ${
                  isActive('/report') ? 'bg-[#111418] text-red-400 border border-red-500/30' : 'text-gray-300 hover:text-white hover:bg-[#111418]'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                Report Activity
              </Link>

              {isAnalyst && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-xs font-mono tracking-wide transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'bg-[#111418] text-red-400 border border-red-500/30' : 'text-emerald-400 hover:bg-[#111418]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-xs font-mono tracking-wide transition-colors flex items-center gap-1.5 ${
                    isActive('/admin') ? 'bg-[#111418] text-red-400 border border-red-500/30' : 'text-amber-400 hover:bg-[#111418]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right Actions & Demo Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 rounded bg-[#111418] border border-[#1E2631] text-[11px] font-mono text-gray-300 hover:border-gray-600 flex items-center gap-1.5 transition-colors"
                title="Quick Demo Role Switcher"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0B0D10] border border-[#1E2631] rounded-md shadow-2xl py-1 z-50 text-xs font-mono">
                  <div className="px-3 py-1.5 text-[10px] text-gray-500 border-b border-[#1E2631]">
                    QUICK DEMO SWITCH
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('ADMIN')}
                    className="w-full text-left px-3 py-2 hover:bg-red-950/40 text-red-400 flex items-center justify-between"
                  >
                    <span>🛡️ Admin Account</span>
                    {user?.role === 'ADMIN' && <span className="text-[10px] text-emerald-400">Active</span>}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('ANALYST')}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/40 text-emerald-400 flex items-center justify-between"
                  >
                    <span>🔍 Analyst Account</span>
                    {user?.role === 'ANALYST' && <span className="text-[10px] text-emerald-400">Active</span>}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('USER')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-gray-300 flex items-center justify-between"
                  >
                    <span>👤 Public User</span>
                    {user?.role === 'USER' && <span className="text-[10px] text-emerald-400">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#1E2631]">
                <div className="flex items-center gap-2 px-2 py-1 bg-[#111418] rounded border border-[#1E2631]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span className="text-xs font-mono text-gray-200 font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-mono text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-mono font-medium rounded bg-red-600 hover:bg-red-700 text-white shadow-glow-red transition-all"
                >
                  Get Access
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0D10] border-b border-[#1E2631] px-4 pt-2 pb-4 space-y-2 font-mono text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-gray-300 hover:bg-[#111418]"
          >
            Home
          </Link>
          <Link
            to="/scams"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-gray-300 hover:bg-[#111418]"
          >
            Scam Database
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-red-400 hover:bg-[#111418]"
          >
            Report Activity
          </Link>

          {isAnalyst && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-emerald-400 hover:bg-[#111418]"
            >
              Analyst Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-amber-400 hover:bg-[#111418]"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-3 border-t border-[#1E2631] flex flex-col gap-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Demo Quick Login</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleDemoSwitch('ADMIN');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-[10px] bg-red-950/60 border border-red-800/40 text-red-300 rounded text-center"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('ANALYST');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-[10px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded text-center"
              >
                Analyst
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('USER');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 text-[10px] bg-gray-800 border border-gray-700 text-gray-300 rounded text-center"
              >
                User
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
