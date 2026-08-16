import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const alertMessages = [
  'Device-switching fraud activity increased 34% this month.',
  'Behavioral anomalies detected in 18% of high-risk onboarding sessions.',
  'Traditional identity checks can miss behaviorally anomalous sessions.',
  'Suspicious activity should always be reviewed before final approval.',
];

export const HeaderAlertBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alertMessages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Global Fraud Security Alerts"
      className="bg-[#111418] border-b border-red-900/40 text-xs px-4 py-2 relative z-50 text-gray-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0" aria-live="polite">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-400 font-mono font-semibold tracking-wider text-[11px] shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            ACTIVE FRAUD SIGNAL
          </span>

          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="truncate text-gray-200 font-mono"
            >
              {alertMessages[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block text-[11px] text-gray-500 font-mono">
            UPDATED: REAL-TIME
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
            aria-label="Dismiss fraud alert banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
