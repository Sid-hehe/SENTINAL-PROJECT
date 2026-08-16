import React from 'react';
import { Shield, Lock, Eye, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0D10] border-t border-[#1E2631] py-12 px-4 text-gray-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-600/80 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-widest text-sm">SENTINEL</span>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Sentinel is a behavioral fraud intelligence platform that detects suspicious activity by understanding interaction patterns — not just identity fields.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-[#111418] px-2.5 py-1 rounded border border-[#1E2631] w-fit">
            <Lock className="w-3 h-3" />
            <span>v1.0.0 Decision Support Active</span>
          </div>
        </div>

        {/* Intelligence Platform Links */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-3 text-gray-200">
            Platform Capabilities
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link to="/#how-it-works" className="hover:text-red-400 transition-colors">Behavioral Signal Engine</Link></li>
            <li><Link to="/scams" className="hover:text-red-400 transition-colors">Scam & Fraud Typologies</Link></li>
            <li><Link to="/report" className="hover:text-red-400 transition-colors">Public Incident Reporting</Link></li>
            <li><Link to="/dashboard" className="hover:text-red-400 transition-colors">Analyst Command Center</Link></li>
          </ul>
        </div>

        {/* Trust & Responsible AI */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-3 text-gray-200">
            Trust & Compliance
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-center gap-1.5 text-gray-300">
              <Eye className="w-3 h-3 text-red-400" />
              <span>Zero Keystroke Content Capture</span>
            </li>
            <li className="flex items-center gap-1.5 text-gray-300">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>Human-in-the-Loop Review</span>
            </li>
            <li className="text-gray-400">Explainable Scoring Weights</li>
            <li className="text-gray-400">Fairness & Bias Audits</li>
          </ul>
        </div>

        {/* Hackathon Demo Credentials */}
        <div className="bg-[#111418] p-3.5 rounded border border-[#1E2631] space-y-2">
          <h4 className="text-amber-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
            🔑 Demo Access Quick-Ref
          </h4>
          <div className="text-[10px] space-y-1 text-gray-300">
            <p><span className="text-gray-500">Admin:</span> admin@sentinel.demo</p>
            <p><span className="text-gray-500">Analyst:</span> analyst@sentinel.demo</p>
            <p><span className="text-gray-500">Password:</span> SentinelDemo123!</p>
          </div>
          <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-800">
            Use navigation menu dropdown to switch roles instantaneously.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#1E2631] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
        <p>© 2026 Sentinel Behavioral Intelligence. All rights reserved.</p>
        <p className="font-mono">
          Sentinel v1.0 — <span className="text-red-400">Does this behavior look consistent with legitimate human behavior?</span>
        </p>
      </div>
    </footer>
  );
};
