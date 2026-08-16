import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Trash2, ShieldAlert, Zap, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TelemetryEvent {
  id: string;
  sessionId: string;
  ruleName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  details: string;
}

interface RealtimeEventFeedProps {
  onNewEvent?: (event: TelemetryEvent) => void;
}

export const RealtimeEventFeed: React.FC<RealtimeEventFeedProps> = ({ onNewEvent }) => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    // Standard SSE EventSource listener
    const eventSource = new EventSource('/api/sessions/stream');

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.addEventListener('FRAUD_ATTACK_SIMULATED', (e: any) => {
      if (paused) return;
      try {
        const payload = JSON.parse(e.data);
        const session = payload.session;

        const newEvt: TelemetryEvent = {
          id: `${session.id}-${Date.now()}`,
          sessionId: session.sessionId,
          ruleName: session.topSignal || 'Behavioral Anomaly',
          severity: session.riskTier || 'CRITICAL',
          timestamp: new Date().toLocaleTimeString(),
          details: session.recommendation,
        };

        setEvents((prev) => [newEvt, ...prev.slice(0, 49)]); // keep last 50
        if (onNewEvent) onNewEvent(newEvt);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [paused, onNewEvent]);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800 font-bold';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800 font-bold';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-4 font-mono text-xs shadow-2xl">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-[#1E2631] pb-3">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${connected && !paused ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
          <span className="font-bold text-white uppercase tracking-wider">REAL-TIME TELEMETRY EVENT STREAM</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] ${
              connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'
            }`}
          >
            {connected ? (paused ? 'STREAM PAUSED' : 'LIVE STREAM ACTIVE') : 'OFFLINE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!paused)}
            className="px-2.5 py-1 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-300 hover:text-white flex items-center gap-1.5"
          >
            {paused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{paused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          <button
            onClick={() => setEvents([])}
            className="p-1 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-400 hover:text-red-400"
            title="Clear Stream Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline Event Feed */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-[11px] bg-[#0B0D10] rounded border border-[#1E2631]">
            <Zap className="w-5 h-5 mx-auto mb-1.5 text-amber-400/60 animate-pulse" />
            <span>Listening for real-time fraud events. Click "Trigger Live Attack" in control widget to broadcast.</span>
          </div>
        ) : (
          <AnimatePresence>
            {events.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded bg-[#0B0D10] border border-red-900/30 flex items-start justify-between gap-3 hover:border-red-500/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{evt.timestamp}</span>
                    <span className="font-bold text-white">{evt.sessionId}</span>
                    <span className="text-red-400 font-semibold">{evt.ruleName}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">{evt.details}</p>
                </div>

                <span className={`px-2 py-0.5 rounded border text-[10px] shrink-0 ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
