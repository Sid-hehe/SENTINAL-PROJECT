import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck, Clock, Calendar, Eye, Tag, Activity, BookOpen } from 'lucide-react';
import { ScamPattern } from '../../types';

interface ScamDetailModalProps {
  scam: ScamPattern | null;
  onClose: () => void;
}

export const ScamDetailModal: React.FC<ScamDetailModalProps> = ({ scam, onClose }) => {
  if (!scam) return null;

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0B0D10] border border-[#1E2631] rounded-xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl font-sans text-xs relative text-gray-200"
        >
          {/* Header */}
          <div className="bg-[#111418] p-6 border-b border-[#1E2631] flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className={`px-2.5 py-0.5 rounded border text-[11px] font-bold uppercase ${getRiskColor(scam.riskTier)}`}>
                  {scam.riskTier} RISK
                </span>
                <span className="px-2.5 py-0.5 rounded bg-gray-800 text-gray-300 text-[11px] font-mono border border-gray-700">
                  {scam.fraudType.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0B0D10] text-gray-400 text-[10px] font-mono border border-gray-800">
                  STATUS: {scam.status}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white font-display">{scam.title}</h2>
              <p className="text-gray-400 text-xs font-mono">{scam.description}</p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors shrink-0"
              aria-label="Close scam pattern modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-400" />
                Pattern Overview & Mechanism
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed font-sans bg-[#111418] p-4 rounded border border-[#1E2631]">
                {scam.detailedDescription}
              </p>
            </div>

            {/* Behavioral Indicators */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Key Behavioral Red Flags (Telemetry Indicators)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono">
                {scam.behavioralRedFlags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded bg-red-950/20 border border-red-900/40 text-red-200 flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">⚠</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Protection Guidance */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Recommended Protection Guidance
              </h3>
              <div className="space-y-2 font-mono">
                {scam.protectionTips.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4 bg-[#111418] p-4 rounded border border-[#1E2631] font-mono text-center">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">EXAMPLE RISK SCORE</span>
                <span className="text-lg font-bold text-red-400">{scam.exampleRiskScore} / 100</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">FIRST IDENTIFIED</span>
                <span className="text-xs text-gray-300 font-semibold">{scam.firstIdentified}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">LAST SEEN</span>
                <span className="text-xs text-emerald-400 font-semibold">{scam.lastSeen}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-[#111418] px-6 py-4 border-t border-[#1E2631] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-mono font-semibold text-xs transition-colors"
            >
              Done Reviewing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
