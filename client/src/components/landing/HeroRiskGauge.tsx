import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Cpu, ArrowRight, Activity, Terminal, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroRiskGauge: React.FC = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const targetScore = 87;
    const duration = 1800; // 1.8 seconds
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = targetScore / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 bg-cyber-grid border-b border-[#1E2631]">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Messaging */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 font-mono text-xs tracking-wider uppercase shadow-glow-red">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Behavioral Fraud Intelligence Engine v1.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-display">
              Fraud doesn't always look suspicious.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-500 underline decoration-red-600/50 decoration-wavy">
                Behavior does.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans font-normal">
              Sentinel detects subtle behavioral anomalies — typing cadence, field corrections, navigation trajectories, and device switches — that traditional identity & rule-based systems completely miss.
            </p>

            {/* Principles Highlight Card */}
            <div className="p-3.5 rounded-lg bg-[#111418] border border-red-900/30 text-xs font-mono text-gray-300 flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block mb-0.5">Core System Directive:</span>
                Sentinel v1 provides human-in-the-loop decision support. It routes suspicious behavior to fraud analysts and <strong className="text-red-400 font-normal">never autonomously blocks</strong> a legitimate customer.
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center gap-2 shadow-glow-red transition-all group"
              >
                <span>Explore Sentinel Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/scams"
                className="px-6 py-3 rounded bg-[#111418] hover:bg-gray-800 text-gray-200 border border-[#1E2631] font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <span>View Scam Database</span>
              </Link>
            </div>

            {/* Trust Metrics Pill */}
            <div className="pt-4 flex items-center gap-6 text-xs text-gray-400 font-mono border-t border-[#1E2631]/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Keystroke Content Capture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Explainable Signal Breakdown</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Risk Session Visualization */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="cyber-card rounded-xl p-6 relative overflow-hidden border-red-900/40 shadow-2xl scanline-overlay"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#1E2631] pb-4 mb-4 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs text-gray-400 font-medium">LIVE SESSION MONITOR</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50 font-bold">
                  SESSION #48291
                </span>
              </div>

              {/* Animated Risk Gauge Centerpiece */}
              <div className="flex flex-col items-center justify-center py-4 bg-[#0B0D10]/80 rounded-lg border border-[#1E2631] mb-5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Unified Risk Engine Score
                </span>

                <div className="relative flex items-center justify-center">
                  {/* Circular Glow Indicator */}
                  <div className="text-6xl font-mono font-extrabold tracking-tight text-red-500 drop-shadow-[0_0_25px_rgba(225,29,42,0.6)]">
                    {score}
                    <span className="text-2xl text-gray-500 font-normal"> / 100</span>
                  </div>
                </div>

                {/* Risk Tier Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-950 text-red-400 font-mono font-bold text-xs tracking-wider border border-red-600/60 shadow-glow-red">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>CRITICAL RISK TIER</span>
                </div>
              </div>

              {/* Behavioral Signals Breakdown List */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-400 border-b border-gray-800/60 pb-1 text-[11px]">
                  <span>CONTRIBUTING BEHAVIORAL SIGNAL</span>
                  <span>SCORE IMPACT</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#111418] border border-red-900/30 hover:border-red-500/40 transition-colors">
                  <span className="text-gray-200">Device switching (Mobile → Linux)</span>
                  <span className="text-red-400 font-bold">+24</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#111418] border border-[#1E2631] hover:border-red-500/40 transition-colors">
                  <span className="text-gray-200">Transaction velocity spike</span>
                  <span className="text-red-400 font-bold">+20</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#111418] border border-[#1E2631] hover:border-red-500/40 transition-colors">
                  <span className="text-gray-200">Fast completion (4.1s vs 45s avg)</span>
                  <span className="text-amber-400 font-bold">+18</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#111418] border border-[#1E2631] hover:border-red-500/40 transition-colors">
                  <span className="text-gray-200">Direct URL navigation anomaly</span>
                  <span className="text-amber-400 font-bold">+15</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#111418] border border-[#1E2631] hover:border-red-500/40 transition-colors">
                  <span className="text-gray-200">100% paste ratio (0 corrections)</span>
                  <span className="text-blue-400 font-bold">+10</span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="mt-4 pt-3 border-t border-[#1E2631] text-[11px] font-mono text-gray-300 bg-red-950/20 p-2.5 rounded border border-red-900/40">
                <span className="text-red-400 font-semibold block mb-0.5">ENGINE RECOMMENDATION:</span>
                Route session to fraud analyst prior to funds release.
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
