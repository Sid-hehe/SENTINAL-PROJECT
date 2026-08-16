import React from 'react';
import { UserCheck, ShieldAlert, ClipboardCheck, Cpu, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

const protectionAudiences = [
  {
    icon: UserCheck,
    title: 'Genuine Customers',
    tagline: 'Frictionless Experience',
    description: 'Eliminate redundant MFA challenges and step-up friction for legitimate humans behaving naturally.',
    color: 'emerald',
    badge: '91.8% Seamless',
  },
  {
    icon: ShieldAlert,
    title: 'Fraud Analysts',
    tagline: 'Explainable Triage',
    description: 'Transform thousands of raw telemetry signals into prioritized, human-readable case investigations.',
    color: 'red',
    badge: 'Decision Support',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance Teams',
    tagline: 'Auditable Case Trail',
    description: 'Maintain strict immutable audit logs of every analyst review and model recommendation for regulatory compliance.',
    color: 'amber',
    badge: '100% Auditable',
  },
  {
    icon: Cpu,
    title: 'Product & Engineering',
    tagline: 'Plug-and-Play Intel',
    description: 'Embed behavioral intelligence APIs seamlessly without overhauling existing auth or identity stacks.',
    color: 'blue',
    badge: 'REST & GraphQL',
  },
  {
    icon: LifeBuoy,
    title: 'Fraud Victims',
    tagline: 'Public Defense',
    description: 'Empower victims to search documented scam typologies and securely submit suspicious incidents.',
    color: 'purple',
    badge: 'Public Database',
  },
];

export const WhoSentinelProtects: React.FC = () => {
  return (
    <section className="py-20 bg-[#080A0D] border-b border-[#1E2631]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase px-3 py-1 rounded bg-red-950/60 border border-red-800/40">
            Multi-Stakeholder Protection
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Who Sentinel Protects
          </h2>
          <p className="text-gray-400 text-sm font-sans max-w-xl mx-auto">
            Sentinel bridges the gap between customer experience, fraud prevention, and audit compliance across the entire organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protectionAudiences.map((aud, index) => {
            const Icon = aud.icon;
            return (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="cyber-card rounded-xl p-6 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0B0D10] border border-[#1E2631] flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-300">
                      {aud.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider block mb-1">
                    {aud.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 font-display">{aud.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{aud.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2631]/60 flex items-center justify-between text-[11px] font-mono text-gray-500 group-hover:text-red-400 transition-colors">
                  <span>Protected Endpoint</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
