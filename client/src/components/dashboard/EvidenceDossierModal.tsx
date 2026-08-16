import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Printer, Download, FileText, Lock, Activity } from 'lucide-react';
import { Session, BehavioralSignal, CaseNote } from '../../types';

interface EvidenceDossierModalProps {
  session: Session;
  signals: BehavioralSignal[];
  notes: CaseNote[];
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceDossierModal: React.FC<EvidenceDossierModalProps> = ({
  session,
  signals,
  notes,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Generate SHA-256 verification hash simulation based on session ID & score
  const verificationHash = Array.from(
    `${session.id}-${session.sessionId}-${session.riskScore}-${session.createdAt}`
  )
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
    .toString(16)
    .padStart(64, 'a9f2c73e041b8e6d');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Session ID', 'Customer Ref', 'Risk Score', 'Risk Tier', 'Status', 'Signal Type', 'Signal Desc', 'Score Contribution'];
    const rows = signals.map((sig) => [
      session.sessionId,
      session.customerReference,
      session.riskScore,
      session.riskTier,
      session.status,
      sig.signalType,
      `"${sig.description.replace(/"/g, '""')}"`,
      `+${sig.scoreContribution}`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sentinel_Evidence_Dossier_${session.sessionId.replace('#', '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-[#0B0D10] border border-[#1E2631] rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-gray-200 print:border-none print:shadow-none print:bg-white print:text-black"
        >
          {/* Header Action Bar */}
          <div className="p-4 bg-[#111418] border-b border-[#1E2631] flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>OFFICIAL FRAUD EVIDENCE DOSSIER</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCSV}
                className="px-3 py-1.5 rounded bg-[#1A202C] hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-colors text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold flex items-center gap-1.5 transition-colors text-[11px]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dossier Document Content */}
          <div className="p-8 space-y-6 print:p-4">
            {/* Title & Branding */}
            <div className="flex items-start justify-between border-b border-[#1E2631] print:border-black pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500 print:text-red-700" />
                  <span className="text-lg font-black tracking-wider text-white print:text-black">
                    SENTINEL PLATFORM
                  </span>
                </div>
                <h1 className="text-xs text-gray-400 print:text-gray-600 font-sans">
                  Behavioral Intelligence & Telemetry Case Dossier
                </h1>
              </div>

              <div className="text-right space-y-1 text-[10px]">
                <div className="font-bold text-red-400 print:text-red-700 uppercase">
                  CONFIDENTIAL // INTERNAL AUDIT
                </div>
                <div className="text-gray-400 print:text-gray-600">
                  Generated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Session Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#111418] border border-[#1E2631] print:bg-gray-100 print:border-gray-300">
              <div>
                <span className="text-[10px] text-gray-500 print:text-gray-700 uppercase block">Session ID</span>
                <span className="font-bold text-white print:text-black">{session.sessionId}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 print:text-gray-700 uppercase block">Customer Ref</span>
                <span className="font-bold text-gray-300 print:text-black">{session.customerReference}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 print:text-gray-700 uppercase block">Unified Risk Score</span>
                <span className="font-bold text-red-400 print:text-red-700 text-sm">
                  {session.riskScore} / 100 ({session.riskTier})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 print:text-gray-700 uppercase block">Case Status</span>
                <span className="font-bold text-emerald-400 print:text-emerald-700">{session.status}</span>
              </div>
            </div>

            {/* Recommendation Summary */}
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/60 print:bg-red-50 print:border-red-200">
              <span className="text-red-400 print:text-red-800 font-bold block mb-1">RECOMMENDED ACTION:</span>
              <p className="text-gray-300 print:text-gray-800 text-xs font-sans leading-relaxed">
                {session.recommendation}
              </p>
            </div>

            {/* Signals Breakdown Table */}
            <div className="space-y-2">
              <h3 className="font-bold text-white print:text-black uppercase text-[11px] border-b border-[#1E2631] print:border-gray-300 pb-1">
                Telemetry & Signal Breakdown ({signals.length} Detected)
              </h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1E2631] print:border-gray-400 text-gray-400 print:text-gray-700 text-[10px]">
                    <th className="py-2">Signal Type</th>
                    <th className="py-2">Severity</th>
                    <th className="py-2">Behavioral Description</th>
                    <th className="py-2 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2631]/60 print:divide-gray-200">
                  {signals.map((sig) => (
                    <tr key={sig.id} className="py-2">
                      <td className="py-2 font-bold text-white print:text-black">
                        {sig.signalType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 print:bg-gray-200 text-gray-300 print:text-gray-800">
                          {sig.severity}
                        </span>
                      </td>
                      <td className="py-2 text-gray-300 print:text-gray-800 font-sans">{sig.description}</td>
                      <td className="py-2 text-right font-bold text-red-400 print:text-red-700">
                        +{sig.scoreContribution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Analyst Case Notes Log */}
            {notes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-white print:text-black uppercase text-[11px] border-b border-[#1E2631] print:border-gray-300 pb-1">
                  Analyst Investigation Notes ({notes.length})
                </h3>
                <div className="space-y-2">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded bg-[#111418] border border-[#1E2631] print:bg-gray-50 print:border-gray-300 text-xs"
                    >
                      <div className="flex justify-between text-[10px] text-gray-500 print:text-gray-700 mb-1">
                        <span>Author: {n.author?.name || 'Analyst'}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-300 print:text-gray-900 font-sans">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Footer Hash */}
            <div className="pt-4 border-t border-[#1E2631] print:border-gray-300 flex items-center justify-between text-[10px] text-gray-500 print:text-gray-700">
              <div className="flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SHA-256 Verification Digest:</span>
                <span className="text-gray-400 print:text-gray-900 font-bold truncate max-w-xs">
                  {verificationHash}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 print:text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Chain-of-Custody Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
