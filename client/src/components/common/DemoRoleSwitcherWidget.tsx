import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sessionApi } from '../../api/sessionApi';
import { Role } from '../../types';
import { Shield, Users, User, Zap, ChevronUp, ChevronDown, Activity, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const DemoRoleSwitcherWidget: React.FC = () => {
  const { user, switchDemoAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleRoleSwitch = async (targetRole: Role) => {
    const ok = await switchDemoAccount(targetRole);
    if (ok) {
      if (targetRole === 'ADMIN') navigate('/admin');
      else if (targetRole === 'ANALYST') navigate('/dashboard');
      else navigate('/');
    }
  };

  const handleSimulateAttack = async () => {
    setSimulating(true);
    try {
      // Switch to Analyst first if not already an analyst/admin
      if (user?.role !== 'ANALYST' && user?.role !== 'ADMIN') {
        await switchDemoAccount('ANALYST');
      }

      const res = await sessionApi.simulateSession();
      if (res.success && res.data) {
        toast.error(
          `⚡ SIMULATED ATTACK DETECTED`,
          `High-risk Session ${res.data.sessionId} (${res.data.riskScore}/100 CRITICAL) injected in real-time!`
        );
        navigate('/dashboard');
      } else {
        toast.error('Simulation Failed', res.error?.message);
      }
    } finally {
      setSimulating(false);
    }
  };

  const currentRole = user?.role || 'USER';

  return (
    <div className="fixed bottom-5 left-5 z-50 font-mono text-xs">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 p-4 rounded-xl bg-[#0B0D10]/95 border border-red-900/50 shadow-2xl backdrop-blur-md w-72 space-y-3 text-gray-200"
          >
            <div className="flex items-center justify-between border-b border-[#1E2631] pb-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                HACKATHON DEMO CONTROL
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-white p-0.5"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Role Switcher Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-500 block uppercase font-semibold">
                Instant One-Click Role Switch:
              </span>

              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between border transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-red-950/80 border-red-600 text-red-300 font-bold'
                    : 'bg-[#111418] border-[#1E2631] text-gray-300 hover:border-red-500/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span>Admin Mode</span>
                </span>
                {currentRole === 'ADMIN' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => handleRoleSwitch('ANALYST')}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between border transition-all ${
                  currentRole === 'ANALYST'
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold'
                    : 'bg-[#111418] border-[#1E2631] text-gray-300 hover:border-emerald-500/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Fraud Analyst Mode</span>
                </span>
                {currentRole === 'ANALYST' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => handleRoleSwitch('USER')}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between border transition-all ${
                  currentRole === 'USER'
                    ? 'bg-gray-800 border-gray-600 text-white font-bold'
                    : 'bg-[#111418] border-[#1E2631] text-gray-300 hover:border-gray-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Public User Mode</span>
                </span>
                {currentRole === 'USER' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>

            {/* Live Attack Simulator Button */}
            <div className="pt-2 border-t border-[#1E2631]">
              <button
                onClick={handleSimulateAttack}
                disabled={simulating}
                className="w-full py-2.5 px-3 rounded bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 animate-bounce" />
                <span>{simulating ? 'Simulating Attack...' : '⚡ Trigger Live Fraud Attack'}</span>
              </button>
              <span className="text-[9px] text-gray-500 block text-center mt-1">
                Injects real critical session into DB & opens Dashboard
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Pill */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="px-3.5 py-2 rounded-full bg-[#0B0D10] border border-red-500/50 text-white font-bold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all group backdrop-blur-md"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
        <span className="text-gray-300 font-mono">Role:</span>
        <span className="text-red-400 font-mono font-bold uppercase">{currentRole}</span>
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
