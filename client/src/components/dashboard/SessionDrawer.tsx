import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle, HelpCircle, AlertTriangle, Send, User, Clock, FileText, Activity, FileDown } from 'lucide-react';
import { Session, BehavioralSignal, CaseNote } from '../../types';
import { sessionApi } from '../../api/sessionApi';
import { useToast } from '../../context/ToastContext';
import { BehavioralCadenceChart } from './BehavioralCadenceChart';
import { EvidenceDossierModal } from './EvidenceDossierModal';

interface SessionDrawerProps {
  session: Session | null;
  onClose: () => void;
  onSessionUpdated: (updated: Session) => void;
}

export const SessionDrawer: React.FC<SessionDrawerProps> = ({
  session,
  onClose,
  onSessionUpdated,
}) => {
  const [signals, setSignals] = useState<BehavioralSignal[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!session) return;

    // Load full session signals & notes
    sessionApi.getSessionById(session.id).then((res) => {
      if (res.success && res.data) {
        setSignals(res.data.signals || []);
        setNotes(res.data.notes || []);
      }
    });
  }, [session]);

  const handleStatusUpdate = async (status: string) => {
    if (!session) return;
    setUpdatingStatus(true);
    try {
      const res = await sessionApi.updateSessionStatus(session.id, status);
      if (res.success && res.data) {
        onSessionUpdated(res.data);
        toast.success('Case Status Updated', `Session ${session.sessionId} marked as ${status}`);
      } else {
        toast.error('Update Failed', res.error?.message);
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Drawer level Hotkeys (F: Fraud, L: Legit, I: Info, Esc: Close)
  useEffect(() => {
    if (!session) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore hotkeys when typing in input/textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleStatusUpdate('CONFIRMED_FRAUD');
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleStatusUpdate('CONFIRMED_LEGITIMATE');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleStatusUpdate('NEEDS_MORE_INFO');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, onClose]);

  if (!session) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await sessionApi.addNote(session.id, newNote);
      if (res.success && res.data) {
        setNotes((prev) => [res.data!, ...prev]);
        setNewNote('');
        toast.success('Analyst Note Saved', 'Internal case note added');
      } else {
        toast.error('Failed to save note', res.error?.message);
      }
    } finally {
      setSubmittingNote(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return 'text-red-400 border-red-800 bg-red-950/60';
      case 'HIGH':
        return 'text-amber-400 border-amber-800 bg-amber-950/60';
      case 'MEDIUM':
        return 'text-blue-400 border-blue-800 bg-blue-950/60';
      default:
        return 'text-emerald-400 border-emerald-800 bg-emerald-950/60';
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm overflow-hidden">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-2xl bg-[#0B0D10] border-l border-[#1E2631] h-full flex flex-col justify-between shadow-2xl font-mono text-xs text-gray-200"
          >
            {/* Drawer Header */}
            <div className="p-5 bg-[#111418] border-b border-[#1E2631] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-red-950/80 border border-red-800 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">SESSION {session.sessionId}</h2>
                    <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                      {session.customerReference}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Status: <strong className="text-white">{session.status}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDossierOpen(true)}
                  className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-bold flex items-center gap-1.5 transition-colors text-[11px]"
                  title="Generate printable PDF evidence package"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Evidence Dossier</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                  aria-label="Close investigation panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Hotkeys Quick Reference Bar */}
              <div className="px-3 py-2 rounded bg-[#111418] border border-[#1E2631] flex items-center justify-between text-[10px] text-gray-400">
                <span className="font-bold text-gray-300">ANALYST HOTKEYS ACTIVE:</span>
                <div className="flex gap-2 font-mono">
                  <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-red-400 font-bold">F</kbd> Fraud</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-emerald-400 font-bold">L</kbd> Legit</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-amber-400 font-bold">I</kbd> Info</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-gray-300 font-bold">Esc</kbd> Close</span>
                </div>
              </div>

              {/* Status Indicator Badges Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded bg-[#111418] border border-[#1E2631]">
                  <span className="text-[10px] text-gray-500 block uppercase mb-1">Identity Status</span>
                  <span className="text-xs font-bold text-emerald-400">{session.identityStatus}</span>
                </div>

                <div className="p-3 rounded bg-[#111418] border border-[#1E2631]">
                  <span className="text-[10px] text-gray-500 block uppercase mb-1">Behavioral Pattern</span>
                  <span className="text-xs font-bold text-red-400">{session.behavioralStatus}</span>
                </div>

                <div className="p-3 rounded bg-[#111418] border border-[#1E2631]">
                  <span className="text-[10px] text-gray-500 block uppercase mb-1">Transaction Pattern</span>
                  <span className="text-xs font-bold text-amber-400">{session.transactionStatus}</span>
                </div>
              </div>

              {/* Score & Tier Banner */}
              <div className={`p-4 rounded-lg border flex items-center justify-between ${getTierColor(session.riskTier)}`}>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-semibold block">
                    UNIFIED RISK ENGINE SCORE
                  </span>
                  <div className="text-3xl font-extrabold font-mono">
                    {session.riskScore} <span className="text-sm text-gray-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider block px-2.5 py-1 rounded bg-black/40 border border-current">
                    {session.riskTier} TIER
                  </span>
                  <span className="text-[10px] text-gray-300 block">Top: {session.topSignal}</span>
                </div>
              </div>

              {/* Visual Behavioral Cadence Sparkline Chart */}
              <BehavioralCadenceChart session={session} signals={signals} />

              {/* Recommendation */}
              <div className="p-3.5 rounded bg-[#111418] border border-red-900/40 space-y-1">
                <span className="text-red-400 font-semibold block text-[11px]">RECOMMENDATION:</span>
                <p className="text-gray-300 text-xs font-sans leading-relaxed">{session.recommendation}</p>
              </div>

              {/* Contributing Behavioral Signals Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-[#1E2631] pb-1">
                  Contributing Signals Breakdown ({signals.length})
                </h3>
                <div className="space-y-2">
                  {signals.map((sig) => (
                    <div
                      key={sig.id}
                      className="p-3 rounded bg-[#111418] border border-[#1E2631] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{sig.signalType.replace(/_/g, ' ')}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                            {sig.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans">{sig.description}</p>
                      </div>

                      <span className="text-sm font-bold text-red-400 shrink-0">
                        +{sig.scoreContribution}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyst Case Notes */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white tracking-wider uppercase border-b border-[#1E2631] pb-1">
                  Analyst Case Notes ({notes.length})
                </h3>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal analyst note..."
                    className="flex-1 bg-[#111418] border border-[#1E2631] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !newNote.trim()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Note</span>
                  </button>
                </form>

                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 rounded bg-[#111418] border border-[#1E2631] space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span className="text-red-400 font-semibold">{note.author?.name || 'Analyst'}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-300 font-sans leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions: Confirm Fraud / Confirm Legit / Needs Info */}
            <div className="p-4 bg-[#111418] border-t border-[#1E2631] grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStatusUpdate('CONFIRMED_FRAUD')}
                disabled={updatingStatus}
                className="px-3 py-2.5 rounded bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Confirm Fraud (F)</span>
              </button>

              <button
                onClick={() => handleStatusUpdate('CONFIRMED_LEGITIMATE')}
                disabled={updatingStatus}
                className="px-3 py-2.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Confirm Legit (L)</span>
              </button>

              <button
                onClick={() => handleStatusUpdate('NEEDS_MORE_INFO')}
                disabled={updatingStatus}
                className="px-3 py-2.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-600 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Needs Info (I)</span>
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Printable PDF Evidence Dossier Modal */}
      <EvidenceDossierModal
        session={session}
        signals={signals}
        notes={notes}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </>
  );
};

