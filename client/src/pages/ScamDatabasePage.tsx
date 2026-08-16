import React, { useState, useEffect } from 'react';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ScamDetailModal } from '../components/scams/ScamDetailModal';
import { scamApi } from '../api/scamApi';
import { ScamPattern, RiskTier, FraudType } from '../types';
import { Search, Filter, AlertTriangle, Shield, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const ScamDatabasePage: React.FC = () => {
  const [scams, setScams] = useState<ScamPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskTier, setRiskTier] = useState<string>('ALL');
  const [fraudType, setFraudType] = useState<string>('ALL');
  const [status, setStatus] = useState<string>('ALL');
  const [selectedScam, setSelectedScam] = useState<ScamPattern | null>(null);

  const fetchScams = async () => {
    setLoading(true);
    try {
      const res = await scamApi.getScams({
        search,
        riskTier: riskTier !== 'ALL' ? riskTier : undefined,
        fraudType: fraudType !== 'ALL' ? fraudType : undefined,
        status: status !== 'ALL' ? status : undefined,
      });

      if (res.success && res.data) {
        setScams(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchScams();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, riskTier, fraudType, status]);

  const getRiskBadge = (tier: RiskTier) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase px-3 py-1 rounded bg-red-950/60 border border-red-800/40">
            Threat Intelligence Registry
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Known Fraud & Scam Patterns
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            Explore documented behavioral fraud typologies, technical red flags, and telemetry indicators monitored by Sentinel.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, red flags, or description (e.g. device switching)..."
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <button
              onClick={() => {
                setSearch('');
                setRiskTier('ALL');
                setFraudType('ALL');
                setStatus('ALL');
              }}
              className="px-4 py-2.5 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-400 hover:text-white flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">Risk Tier Filter</label>
              <select
                value={riskTier}
                onChange={(e) => setRiskTier(e.target.value)}
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-red-500"
              >
                <option value="ALL">All Risk Tiers</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">Fraud Typology</label>
              <select
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value)}
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-red-500"
              >
                <option value="ALL">All Fraud Types</option>
                <option value="ACCOUNT_TAKEOVER">Account Takeover</option>
                <option value="ONBOARDING_FRAUD">Onboarding Fraud</option>
                <option value="IDENTITY_THEFT">Identity Theft</option>
                <option value="SOCIAL_ENGINEERING">Social Engineering</option>
                <option value="DEVICE_FRAUD">Device Fraud</option>
                <option value="TRANSACTION_FRAUD">Transaction Fraud</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase block mb-1">Registry Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-red-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Threat</option>
                <option value="HISTORICAL">Historical Pattern</option>
                <option value="UNDER_REVIEW">Under Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-[#1E2631] pb-2">
          <span>Showing <strong className="text-white">{scams.length}</strong> scam pattern intelligence profiles</span>
          <span>Database query status: <strong className="text-emerald-400">200 OK</strong></span>
        </div>

        {/* Scam Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-xs font-mono text-gray-500">
            Fetching registered scam patterns from Sentinel PostgreSQL database...
          </div>
        ) : scams.length === 0 ? (
          <div className="text-center py-20 bg-[#111418] rounded-xl border border-[#1E2631] space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white font-mono">No scam patterns matched your filter criteria</h3>
            <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
              Try adjusting your search terms or resetting risk tier filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scams.map((scam) => (
              <motion.div
                key={scam.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedScam(scam)}
                className="cyber-card p-6 rounded-xl border-[#1E2631] cursor-pointer flex flex-col justify-between space-y-4 group hover:border-red-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded border font-bold ${getRiskBadge(scam.riskTier)}`}>
                      {scam.riskTier}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      {scam.fraudType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display group-hover:text-red-400 transition-colors">
                    {scam.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-2">
                    {scam.description}
                  </p>

                  {/* Red Flags preview */}
                  <div className="space-y-1 pt-2 font-mono text-[11px]">
                    <span className="text-gray-500 uppercase text-[9px] block">TOP BEHAVIORAL INDICATOR:</span>
                    <div className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-300 truncate">
                      ⚠ {scam.behavioralRedFlags[0] || 'Behavioral anomaly detected'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E2631]/60 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>First ID: {scam.firstIdentified}</span>
                  <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Inspect Intel <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>

      {/* Scam Detail Modal */}
      <ScamDetailModal scam={selectedScam} onClose={() => setSelectedScam(null)} />

      <Footer />
    </div>
  );
};
