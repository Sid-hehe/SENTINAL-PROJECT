import React from 'react';
import { Scale, Users, ShieldAlert, CheckCircle2, FileCheck } from 'lucide-react';

export const ResponsibleAISection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B0D10] border-b border-[#1E2631]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Explanation Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Ethical AI & Compliance Framework</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Responsible AI & Accessibility Commitments
            </h2>

            <blockquote className="p-4 rounded-lg bg-[#111418] border-l-4 border-amber-500 text-gray-300 font-mono text-xs leading-relaxed">
              "Behavioral signals can correlate with disability, age, economic circumstances, accessibility needs, and other legitimate differences in user behavior."
            </blockquote>

            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              Because assistive technologies (screen readers, speech-to-text, motor accommodation tools) alter typing cadences and field navigation timing, Sentinel enforces strict safeguards to prevent false accusations and bias against neurodiverse or disabled users.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded bg-[#111418] border border-[#1E2631] space-y-1">
                <span className="text-amber-400 font-semibold block">Human Review Mandate</span>
                <p className="text-gray-400 text-[11px]">No automated blocking in v1. All suspicious signals route to human analysts.</p>
              </div>

              <div className="p-3.5 rounded bg-[#111418] border border-[#1E2631] space-y-1">
                <span className="text-amber-400 font-semibold block">Fairness Audits</span>
                <p className="text-gray-400 text-[11px]">Continuous testing against accessibility profiles to eliminate demographic bias.</p>
              </div>
            </div>
          </div>

          {/* Right Cards List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="cyber-card p-5 rounded-xl border-amber-900/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-amber-950 border border-amber-800 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono mb-1">Accessibility Pattern Calibration</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  System automatically recognizes assistive technology signatures (e.g. NVDA/JAWS screen readers) to adjust hesitation and timing baseline thresholds.
                </p>
              </div>
            </div>

            <div className="cyber-card p-5 rounded-xl border-emerald-900/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono mb-1">Explainable Reasoning for Every Flag</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Every risk tier includes mathematical breakdown proof (+24 device switch, +20 velocity) ensuring customers and compliance teams receive clear answers.
                </p>
              </div>
            </div>

            <div className="cyber-card p-5 rounded-xl border-red-900/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-red-950 border border-red-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono mb-1">No Autonomous Customer Blocking</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Sentinel serves exclusively as decision support for human investigators, preventing false positive lockouts from disrupting legitimate lives.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
