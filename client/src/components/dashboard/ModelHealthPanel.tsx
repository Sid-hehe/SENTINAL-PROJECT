import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, CheckCircle, Power, RefreshCw } from 'lucide-react';
import { ModelHealthData } from '../../types';
import { dashboardApi } from '../../api/dashboardApi';
import { useToast } from '../../context/ToastContext';

export const ModelHealthPanel: React.FC = () => {
  const [healthData, setHealthData] = useState<ModelHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const toast = useToast();

  const fetchHealth = async () => {
    try {
      const res = await dashboardApi.getModelHealth();
      if (res.success && res.data) {
        setHealthData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleToggleAnomaly = async () => {
    setToggling(true);
    try {
      const current = healthData?.anomalyModelEnabled ?? true;
      const res = await dashboardApi.toggleModelHealth(!current);
      if (res.success && res.data) {
        setHealthData(res.data);
        if (!current) {
          toast.success('Anomaly Detection Online', 'Full ML pipeline active');
        } else {
          toast.info('Anomaly Detection Offline', 'Sentinel running in deterministic fallback mode');
        }
      }
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="cyber-card p-6 rounded-xl animate-pulse text-xs font-mono text-gray-500">
        Loading System Model Health metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111418] p-4 rounded-xl border border-[#1E2631]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase">SYSTEM MODEL HEALTH & SIMULATION</h3>
          </div>
          <span className="text-[11px] text-gray-400">
            Real-time status of Sentinel detection layers and pipeline fallback triggers.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHealth}
            className="p-2 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-300 hover:text-white"
            title="Refresh System Health"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleAnomaly}
            disabled={toggling}
            className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 border transition-all ${
              healthData?.anomalyModelEnabled
                ? 'bg-red-950 border-red-700 text-red-300 hover:bg-red-900'
                : 'bg-emerald-950 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{healthData?.anomalyModelEnabled ? 'Simulate Anomaly OFFLINE' : 'Enable Anomaly ONLINE'}</span>
          </button>
        </div>
      </div>

      {/* Fallback Banner if Anomaly Model Disabled */}
      {!healthData?.anomalyModelEnabled && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs flex items-start gap-3 shadow-glow-amber">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block uppercase">ANOMALY MODEL DEGRADED — FALLBACK ACTIVE</span>
            <p className="text-amber-200 font-sans">
              {healthData?.fallbackMessage ||
                'Anomaly detection unavailable. Sentinel is operating using known-pattern detection + deterministic rules.'}
            </p>
          </div>
        </div>
      )}

      {/* Components Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData?.components.map((comp) => (
          <div
            key={comp.name}
            className={`p-4 rounded-xl border bg-[#111418] space-y-2 ${
              comp.status === 'ONLINE'
                ? 'border-[#1E2631] hover:border-emerald-500/40'
                : comp.status === 'DEGRADED'
                ? 'border-amber-500/40'
                : 'border-red-500/50 bg-red-950/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{comp.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  comp.status === 'ONLINE'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : comp.status === 'DEGRADED'
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-red-950 text-red-400 border-red-800'
                }`}
              >
                {comp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 pt-2 border-t border-[#1E2631]/60">
              <div>
                <span className="block text-gray-500">LATENCY:</span>
                <span className="text-gray-200 font-semibold">{comp.latencyMs} ms</span>
              </div>
              <div>
                <span className="block text-gray-500">ACCURACY:</span>
                <span className="text-gray-200 font-semibold">{comp.accuracy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
