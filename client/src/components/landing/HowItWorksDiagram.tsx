import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Zap, Layers, Cpu, ShieldCheck, PieChart, UserCheck, ChevronRight, X, Info } from 'lucide-react';

interface NodeDetail {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  input: string;
  output: string;
  technicalDetails: string[];
}

const architectureNodes: NodeDetail[] = [
  {
    id: 'SESSION',
    title: '1. Customer Session',
    subtitle: 'Client Interaction Capture',
    icon: Monitor,
    description: 'Active user session on web or mobile banking application initiating onboarding, login, or funds transfer.',
    input: 'DOM interaction events, focus times, step progression timing',
    output: 'Raw telemetry stream (No sensitive field values)',
    technicalDetails: [
      'Captures anonymized timing deltas between field focus and submit',
      'Tracks mouse curvature vectors and touch gesture friction',
      'Logs active window focus changes and device orientation',
    ],
  },
  {
    id: 'SIGNALS',
    title: '2. Signal Capture',
    subtitle: 'Behavioral Sensor Engine',
    icon: Zap,
    description: 'Processes raw client interactions into discrete, structured behavioral anomaly signals.',
    input: 'Raw interaction timestamps',
    output: 'Normalized BehavioralSignal records',
    technicalDetails: [
      'TYPING_CADENCE: Keyup/keydown duration histogram',
      'FIELD_CORRECTIONS: Backspace and paste ratio analysis',
      'DEVICE_SWITCH: TLS fingerprint & User-Agent drift monitoring',
    ],
  },
  {
    id: 'FEATURES',
    title: '3. Feature Engineering',
    subtitle: 'Vector Standardization',
    icon: Layers,
    description: 'Aggregates behavioral signals into normalized risk feature vectors, comparing against user historical baselines.',
    input: 'Raw signal outputs',
    output: 'Normalized 128-dim feature tensor',
    technicalDetails: [
      'Calculates deviation z-scores against historical user session profile',
      'Extracts cross-field completion speed ratios',
      'Evaluates transaction velocity over sliding 30-day windows',
    ],
  },
  {
    id: 'MODELS',
    title: '4. Known & Anomaly Models',
    subtitle: 'Dual ML Detection Pipeline',
    icon: Cpu,
    description: 'Parallel evaluation through Known Scam Pattern Matcher and Unsupervised Anomaly Detector.',
    input: 'Feature tensor',
    output: 'Pattern match confidence + Isolation Forest anomaly score',
    technicalDetails: [
      'Known Pattern Model checks 15+ documented attack typologies',
      'Unsupervised model measures distance from human cluster baseline',
      'Supports degraded deterministic fallback mode if anomaly model is offline',
    ],
  },
  {
    id: 'RISK ENGINE',
    title: '5. Unified Risk Engine',
    subtitle: 'Explainable Score Aggregation',
    icon: ShieldCheck,
    description: 'Combines weighted model outputs into a normalized 0–100 risk score and tier assignment.',
    input: 'Model anomaly scores + signal weights',
    output: '0-100 Risk Score + Tier (LOW, MEDIUM, HIGH, CRITICAL)',
    technicalDetails: [
      'Weighted additive engine ensuring 100% explainability',
      'Assigns highest contributing signal for analyst triage',
      'Generates automated decision recommendation text',
    ],
  },
  {
    id: 'EXPLAINABLE SCORE',
    title: '6. Explainable Score Output',
    subtitle: 'Reason Codes & Visual Proof',
    icon: PieChart,
    description: 'Generates transparent score breakdown displaying exact numerical contributions for every signal.',
    input: 'Risk engine metadata',
    output: 'Interactive signal impact table (+24, +18, +15, etc.)',
    technicalDetails: [
      'No black-box opacity — every point added is auditable',
      'Maps mathematical contribution to human-understandable labels',
      'Provides actionable context for customer service phone inquiries',
    ],
  },
  {
    id: 'HUMAN REVIEW',
    title: '7. Human Analyst Review',
    subtitle: 'Final Decision Authority',
    icon: UserCheck,
    description: 'Fraud analyst reviews high-risk cases in Sentinel Command Center and renders final decision.',
    input: 'Session investigation drawer & signal breakdown',
    output: 'Confirmed Fraud / Confirmed Legitimate + Audit Log',
    technicalDetails: [
      'Sentinel v1 NEVER blocks customers autonomously',
      'Analyst clicks generate immutable audit logs',
      'Adds internal case notes for fraud team collaboration',
    ],
  },
];

export const HowItWorksDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);

  return (
    <section id="how-it-works" className="py-20 bg-[#0B0D10] border-b border-[#1E2631]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase px-3 py-1 rounded bg-red-950/60 border border-red-800/40">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            How Sentinel Intelligence Works
          </h2>
          <p className="text-gray-400 text-sm font-sans">
            From raw interaction telemetry to explainable human-in-the-loop review. Click any node to inspect technical specs.
          </p>
        </div>

        {/* Interactive Node Flowchart Diagram */}
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10 overflow-x-auto pb-6 pt-2">
            {architectureNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.id}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNode(node)}
                    className="cyber-card p-4 rounded-xl text-left border-[#1E2631] hover:border-red-500/60 transition-all flex flex-col items-center justify-center text-center w-36 shrink-0 group relative shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-800/50 flex items-center justify-center mb-2 group-hover:bg-red-600 transition-colors">
                      <Icon className="w-5 h-5 text-red-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-semibold mb-0.5">
                      STEP 0{index + 1}
                    </span>
                    <span className="text-xs font-bold text-white font-mono leading-tight group-hover:text-red-400 transition-colors">
                      {node.id.replace('_', ' ')}
                    </span>
                  </motion.button>

                  {index < architectureNodes.length - 1 && (
                    <div className="hidden lg:flex items-center text-gray-600">
                      <ChevronRight className="w-5 h-5 text-red-500/60 animate-pulse" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <span className="text-xs font-mono text-gray-500 flex items-center justify-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              Click any architecture node above to view detailed technical data inputs and outputs.
            </span>
          </div>
        </div>

        {/* Modal for Node Technical Details */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0B0D10] border border-red-900/50 rounded-xl p-6 max-w-lg w-full font-mono text-xs relative shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#1E2631] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-950 flex items-center justify-center border border-red-800">
                      {React.createElement(selectedNode.icon, { className: 'w-4 h-4 text-red-400' })}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedNode.title}</h3>
                      <span className="text-[10px] text-gray-500">{selectedNode.subtitle}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-300 font-sans text-xs leading-relaxed">
                  {selectedNode.description}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-[#111418] p-3 rounded border border-[#1E2631]">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">INPUT DATA:</span>
                    <span className="text-gray-300 text-[11px]">{selectedNode.input}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block mb-1">OUTPUT ARTIFACT:</span>
                    <span className="text-emerald-400 text-[11px] font-semibold">{selectedNode.output}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase block mb-2 font-semibold">
                    TECHNICAL ENGINE SPECIFICATIONS:
                  </span>
                  <ul className="space-y-1 text-[11px] text-gray-300">
                    {selectedNode.technicalDetails.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-red-400">►</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#1E2631] text-right">
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="px-4 py-1.5 rounded bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors"
                  >
                    Close Inspection
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
