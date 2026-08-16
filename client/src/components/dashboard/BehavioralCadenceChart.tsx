import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Activity, Zap, ShieldAlert, MousePointer, Edit3 } from 'lucide-react';
import { Session, BehavioralSignal } from '../../types';

interface BehavioralCadenceChartProps {
  session: Session;
  signals: BehavioralSignal[];
}

export const BehavioralCadenceChart: React.FC<BehavioralCadenceChartProps> = ({
  session,
  signals,
}) => {
  const [activeMetric, setActiveMetric] = useState<'cadence' | 'velocity' | 'corrections'>('cadence');

  // Generate deterministic time-series vector dynamics based on session ID & risk score
  const isHighRisk = session.riskScore >= 70;
  const isBotOrScript = signals.some(
    (s) =>
      s.signalType === 'TYPING_CADENCE' ||
      s.signalType === 'FAST_COMPLETION' ||
      s.description.toLowerCase().includes('bot') ||
      s.description.toLowerCase().includes('0ms')
  );

  // 10 time points throughout session lifecycle (0s to 12s)
  const timeData = Array.from({ length: 12 }, (_, i) => {
    const time = `${i * 1.2}s`;
    
    // Cadence timing variance (ms)
    // Bot: ~5-15ms flat (automated execution). Human: 120ms - 340ms variable curve.
    let cadenceMs: number;
    if (isBotOrScript) {
      cadenceMs = 8 + Math.floor(Math.sin(i) * 4); // Extremely flat bot timing
    } else if (isHighRisk) {
      // Rapid automated paste or sudden burst
      cadenceMs = i > 4 && i < 8 ? 12 : 180 + Math.floor(Math.sin(i * 1.5) * 70);
    } else {
      // Normal legitimate human variance
      cadenceMs = 140 + Math.floor(Math.sin(i * 0.8) * 80) + (i % 3) * 35;
    }

    // Mouse velocity dynamics (px / 100ms)
    let mouseVelocity = isBotOrScript
      ? i % 4 === 0 ? 950 : 20 // Sharp instantaneous teleports
      : Math.floor(220 + Math.sin(i * 0.5) * 160 + (i % 2) * 50);

    // Field corrections count over time
    let correctionsCount = isHighRisk
      ? i > 3 ? Math.min(8, Math.floor((i - 2) * 1.4)) : 0
      : Math.floor(i / 5);

    return {
      time,
      cadenceMs,
      mouseVelocity,
      correctionsCount,
      humanBenchmarkMin: 80,
      humanBenchmarkMax: 260,
    };
  });

  return (
    <div className="p-4 rounded-xl bg-[#111418] border border-[#1E2631] space-y-3 font-mono text-xs">
      {/* Header & Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2631] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-400" />
          <span className="font-bold text-white uppercase text-[11px] tracking-wider">
            Behavioral Telemetry Trajectory
          </span>
          {isBotOrScript && (
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[9px] font-bold animate-pulse">
              AUTOMATED SCRIPT DETECTED
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-[#0B0D10] p-1 rounded border border-[#1E2631]">
          <button
            onClick={() => setActiveMetric('cadence')}
            className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
              activeMetric === 'cadence'
                ? 'bg-red-900/80 text-white border border-red-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Cadence (ms)</span>
          </button>

          <button
            onClick={() => setActiveMetric('velocity')}
            className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
              activeMetric === 'velocity'
                ? 'bg-blue-900/80 text-white border border-blue-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MousePointer className="w-3 h-3" />
            <span>Velocity</span>
          </button>

          <button
            onClick={() => setActiveMetric('corrections')}
            className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
              activeMetric === 'corrections'
                ? 'bg-amber-900/80 text-white border border-amber-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Corrections</span>
          </button>
        </div>
      </div>

      {/* Metric Context Banner */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
        {activeMetric === 'cadence' && (
          <>
            <span>Inter-Keystroke Interval (ms) over Session Timeline</span>
            <span className="text-emerald-400">Human Norm: 80ms – 260ms</span>
          </>
        )}
        {activeMetric === 'velocity' && (
          <>
            <span>Cursor Trajectory Velocity (px/sec)</span>
            <span className="text-blue-400">Natural Curvature: Smooth Acceleration</span>
          </>
        )}
        {activeMetric === 'corrections' && (
          <>
            <span>Accumulated Backspace & Field Correction Count</span>
            <span className="text-amber-400">High Corrections = Pressure / Scripting</span>
          </>
        )}
      </div>

      {/* Chart Visualization */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cadenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isBotOrScript ? '#EF4444' : '#10B981'} stopOpacity={0.5} />
                <stop offset="95%" stopColor={isBotOrScript ? '#EF4444' : '#10B981'} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="correctionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="time" stroke="#6B7280" fontSize={10} tickLine={false} />
            <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0D10',
                borderColor: '#1E2631',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#fff',
              }}
            />

            {activeMetric === 'cadence' && (
              <>
                <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Bot Threshold (50ms)', fill: '#EF4444', fontSize: 9 }} />
                <Area
                  type="monotone"
                  dataKey="cadenceMs"
                  stroke={isBotOrScript ? '#EF4444' : '#10B981'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cadenceGrad)"
                  name="Cadence Interval (ms)"
                />
              </>
            )}

            {activeMetric === 'velocity' && (
              <Area
                type="monotone"
                dataKey="mouseVelocity"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#velocityGrad)"
                name="Mouse Velocity (px/s)"
              />
            )}

            {activeMetric === 'corrections' && (
              <Area
                type="stepAfter"
                dataKey="correctionsCount"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#correctionsGrad)"
                name="Corrections Count"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Insights Legend Footer */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2631] text-[10px] text-center text-gray-400">
        <div>
          <span>Avg Cadence: </span>
          <strong className={isBotOrScript ? 'text-red-400' : 'text-emerald-400'}>
            {Math.round(timeData.reduce((acc, d) => acc + d.cadenceMs, 0) / timeData.length)}ms
          </strong>
        </div>
        <div>
          <span>Peak Velocity: </span>
          <strong className="text-blue-400">
            {Math.max(...timeData.map((d) => d.mouseVelocity))} px/s
          </strong>
        </div>
        <div>
          <span>Field Edits: </span>
          <strong className="text-amber-400">
            {Math.max(...timeData.map((d) => d.correctionsCount))} loops
          </strong>
        </div>
      </div>
    </div>
  );
};
