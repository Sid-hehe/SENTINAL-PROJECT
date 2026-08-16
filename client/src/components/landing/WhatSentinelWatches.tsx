import React from 'react';
import { Clock, Edit3, Compass, Keyboard, Smartphone, Calendar, LogIn, TrendingUp, ShieldCheck, Lock } from 'lucide-react';

const watchedSignals = [
  {
    icon: Clock,
    title: 'Time Per Step',
    description: 'Measures delta time spent reviewing form steps vs. instant bot speed-running.',
  },
  {
    icon: Edit3,
    title: 'Field Corrections',
    description: 'Tracks backspace frequency, field edits, and clipboard paste vs typing ratio.',
  },
  {
    icon: Compass,
    title: 'Navigation Patterns',
    description: 'Identifies direct URL jumps bypassing standard UI menus or dashboard tabs.',
  },
  {
    icon: Keyboard,
    title: 'Typing Cadence',
    description: 'Analyzes keydown/keyup timing distribution and human micro-hesitation variance.',
  },
  {
    icon: Smartphone,
    title: 'Device Switching',
    description: 'Detects mid-session jumps between mobile, desktop, and proxy user agents.',
  },
  {
    icon: Calendar,
    title: 'Session Timing',
    description: 'Flags unusual session durations and inactive idle windows during sensitive flows.',
  },
  {
    icon: LogIn,
    title: 'Login Timing',
    description: 'Monitors abnormal time-of-day access relative to historical customer baseline.',
  },
  {
    icon: TrendingUp,
    title: 'Transaction Velocity',
    description: 'Evaluates rapid sequential transfer volume immediately following profile updates.',
  },
];

export const WhatSentinelWatches: React.FC = () => {
  return (
    <section className="py-20 bg-[#080A0D] border-b border-[#1E2631]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Privacy & Trust Callout Banner */}
        <div className="mb-16 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#111418] to-emerald-950/60 border border-emerald-500/40 shadow-glow-green text-center max-w-4xl mx-auto space-y-2 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Privacy Guarantee</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Sentinel Never Captures Keystrokes or Passwords
          </h3>

          <blockquote className="text-emerald-200 font-mono text-sm sm:text-base leading-relaxed italic max-w-2xl mx-auto">
            "Sentinel never captures keystroke content, passwords, or sensitive field values. It analyzes interaction patterns, not what users type."
          </blockquote>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase px-3 py-1 rounded bg-red-950/60 border border-red-800/40">
            Telemetry Sensors
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            What Sentinel Watches
          </h2>
          <p className="text-gray-400 text-sm font-sans">
            Eight non-intrusive behavioral telemetry signals evaluated in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watchedSignals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.title}
                className="cyber-card p-5 rounded-xl border-[#1E2631] hover:border-red-500/40 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0B0D10] border border-[#1E2631] flex items-center justify-center text-red-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-mono">{signal.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{signal.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
