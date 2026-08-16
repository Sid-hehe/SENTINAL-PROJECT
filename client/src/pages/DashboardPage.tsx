import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { SessionDrawer } from '../components/dashboard/SessionDrawer';
import { ModelHealthPanel } from '../components/dashboard/ModelHealthPanel';
import { RealtimeEventFeed } from '../components/dashboard/RealtimeEventFeed';
import { dashboardApi } from '../api/dashboardApi';
import { sessionApi } from '../api/sessionApi';
import { reportApi } from '../api/reportApi';
import { DashboardStats, Session, SuspiciousReport } from '../types';
import {
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  FileText,
  CheckCircle,
  XCircle,
  CheckSquare,
  Square,
  Download,
  Keyboard,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, isAnalyst } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'sessions' | 'health' | 'reports'>('sessions');

  // Dashboard Stats State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any>(null);

  // Sessions Table State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionSearch, setSessionSearch] = useState('');
  const [riskTierFilter, setRiskTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Hotkeys & Bulk Actions State
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number>(0);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);

  // Public Reports State
  const [reports, setReports] = useState<SuspiciousReport[]>([]);

  // Real-time freshness ticker
  const [lastUpdatedSec, setLastUpdatedSec] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, trendsRes, sessionsRes, reportsRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getTrends(),
        sessionApi.getSessions({
          search: sessionSearch,
          riskTier: riskTierFilter !== 'ALL' ? riskTierFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          page,
          limit: 8,
        }),
        reportApi.getReports(),
      ]);

      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (trendsRes.success && trendsRes.data) setTrends(trendsRes.data);
      if (sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data.sessions);
        setTotalPages(sessionsRes.data.pagination.totalPages);
      }
      if (reportsRes.success && reportsRes.data) setReports(reportsRes.data);

      setLastUpdatedSec(0);
    } finally {
      setLoading(false);
    }
  }, [sessionSearch, riskTierFilter, statusFilter, page]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Table Hotkeys Listener (J / K navigation, O / Enter to open)
  useEffect(() => {
    if (activeTab !== 'sessions' || selectedSession !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }

      if (e.key.toLowerCase() === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedRowIndex((prev) => Math.min(sessions.length - 1, prev + 1));
      } else if (e.key.toLowerCase() === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedRowIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === 'o' || e.key === 'Enter') {
        e.preventDefault();
        if (sessions[highlightedRowIndex]) {
          setSelectedSession(sessions[highlightedRowIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedSession, sessions, highlightedRowIndex]);

  const handleToggleSelectAll = () => {
    if (selectedSessionIds.length === sessions.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(sessions.map((s) => s.id));
    }
  };

  const handleToggleSelectSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedSessionIds.length === 0) return;
    try {
      await sessionApi.updateBatchStatus(selectedSessionIds, status);
      toast.success(
        'Batch Update Complete',
        `${selectedSessionIds.length} sessions updated to ${status.replace(/_/g, ' ')}`
      );
      setSelectedSessionIds([]);
      fetchDashboardData();
    } catch (err: any) {
      toast.error('Batch Update Failed', err.message);
    }
  };

  const handleExportCSV = () => {
    const targetSessions = selectedSessionIds.length > 0
      ? sessions.filter((s) => selectedSessionIds.includes(s.id))
      : sessions;

    const headers = ['Session ID', 'Customer Ref', 'Risk Score', 'Risk Tier', 'Top Signal', 'Case Status', 'Recommendation'];
    const rows = targetSessions.map((s) => [
      s.sessionId,
      s.customerReference,
      s.riskScore,
      s.riskTier,
      `"${s.topSignal.replace(/"/g, '""')}"`,
      s.status,
      `"${s.recommendation.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sentinel_Triage_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSessionUpdated = (updated: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedSession?.id === updated.id) {
      setSelectedSession(updated);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED_FRAUD':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'CONFIRMED_LEGITIMATE':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'NEEDS_MORE_INFO':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'IN_REVIEW':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2631] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 tracking-wider">FRAUD OPERATIONS COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Behavioral Risk Triage
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-gray-400 bg-[#111418] px-3 py-1.5 rounded border border-[#1E2631]">
              Last updated {lastUpdatedSec}s ago
            </span>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-2">
            <span className="text-[10px] text-gray-500 uppercase block">FRAUD CAUGHT PRE-TRANSACTION</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats?.fraudCaughtPreTransaction.value || '94.2%'}</span>
              <span className="text-xs text-emerald-400 font-bold">{stats?.fraudCaughtPreTransaction.change}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans">{stats?.fraudCaughtPreTransaction.description}</p>
          </div>

          <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-2">
            <span className="text-[10px] text-gray-500 uppercase block">FALSE POSITIVE RATE</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats?.falsePositiveRate.value || '3.7%'}</span>
              <span className="text-xs text-emerald-400 font-bold">{stats?.falsePositiveRate.change}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans">{stats?.falsePositiveRate.description}</p>
          </div>

          <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-2">
            <span className="text-[10px] text-gray-500 uppercase block">MEDIAN TIME-TO-DECISION</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats?.medianTimeToDecision.value || '4m 18s'}</span>
              <span className="text-xs text-emerald-400 font-bold">{stats?.medianTimeToDecision.change}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans">{stats?.medianTimeToDecision.description}</p>
          </div>

          <div className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-2">
            <span className="text-[10px] text-gray-500 uppercase block">ONBOARDING COMPLETION</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">{stats?.onboardingCompletionRate.value || '91.8%'}</span>
              <span className="text-xs text-emerald-400 font-bold">{stats?.onboardingCompletionRate.change}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans">{stats?.onboardingCompletionRate.description}</p>
          </div>
        </div>

        {/* Charts Visualizations Section */}
        {trends && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7-Day Fraud Trend */}
            <div className="lg:col-span-8 cyber-card p-5 rounded-xl border-[#1E2631] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#1E2631] pb-2">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  7-Day Behavioral Fraud Detection Trend
                </span>
                <span className="text-[10px] text-gray-500">SESSIONS vs ANOMALIES</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends.fraudTrend}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D2A" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#E11D2A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#8B949E" fontSize={11} />
                    <YAxis stroke="#8B949E" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0D10', borderColor: '#1E2631', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="totalSessions" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSessions)" name="Total Sessions" />
                    <Area type="monotone" dataKey="flaggedAnomalies" stroke="#E11D2A" fillOpacity={1} fill="url(#colorFraud)" name="Flagged Anomalies" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Pie Chart */}
            <div className="lg:col-span-4 cyber-card p-5 rounded-xl border-[#1E2631] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#1E2631] pb-2">
                <span className="font-bold text-white uppercase">Risk Tier Distribution</span>
                <span className="text-[10px] text-gray-500">ACTIVE CASES</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trends.riskDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {trends.riskDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0B0D10', borderColor: '#1E2631', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View Tabs */}
        <div className="border-b border-[#1E2631] flex items-center gap-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'sessions'
                ? 'text-red-400 border-red-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Sessions Investigation Triage</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'health'
                ? 'text-red-400 border-red-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Model Health & Fallback Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'reports'
                ? 'text-red-400 border-red-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Public Incident Reports ({reports.length})</span>
          </button>
        </div>

        {/* TAB 1: SESSIONS INVESTIGATION TABLE */}
        {activeTab === 'sessions' && (
          <div className="space-y-6 font-mono text-xs">
            {/* Real-time SSE Live Telemetry Event Stream */}
            <RealtimeEventFeed onNewEvent={() => fetchDashboardData()} />

            {/* Analyst Keyboard Navigation Quick Reference Banner */}
            <div className="p-3 rounded-xl bg-[#111418] border border-[#1E2631] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-gray-400">
              <div className="flex items-center gap-2 text-gray-200">
                <Keyboard className="w-4 h-4 text-red-400" />
                <span className="font-bold">ANALYST TRIAGE HOTKEYS:</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-white font-bold">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-white font-bold">K</kbd> Navigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-white font-bold">O</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-white font-bold">Enter</kbd> Investigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-red-400 font-bold">F</kbd> Fraud</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-emerald-400 font-bold">L</kbd> Legit</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-amber-400 font-bold">I</kbd> Info</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0D10] border border-gray-700 text-gray-300 font-bold">Esc</kbd> Close</span>
              </div>
            </div>

            {/* Search, Filters & Export CSV */}
            <div className="cyber-card p-4 rounded-xl border-[#1E2631] flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  placeholder="Search by session #48291, customer ref, or signal..."
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded px-9 py-2 text-white focus:outline-none focus:border-red-500 font-sans text-xs"
                />
              </div>

              <select
                value={riskTierFilter}
                onChange={(e) => setRiskTierFilter(e.target.value)}
                className="bg-[#0B0D10] border border-[#1E2631] rounded px-3 py-2 text-gray-300 focus:outline-none"
              >
                <option value="ALL">All Risk Tiers</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0B0D10] border border-[#1E2631] rounded px-3 py-2 text-gray-300 focus:outline-none"
              >
                <option value="ALL">All Case Statuses</option>
                <option value="NEW">New</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="CONFIRMED_FRAUD">Confirmed Fraud</option>
                <option value="CONFIRMED_LEGITIMATE">Confirmed Legitimate</option>
                <option value="NEEDS_MORE_INFO">Needs More Info</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded bg-[#111418] hover:bg-gray-800 border border-[#1E2631] text-gray-200 font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Export current sessions list to CSV"
              >
                <Download className="w-3.5 h-3.5 text-red-400" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Floating Bulk Triage Toolbar */}
            {selectedSessionIds.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-between gap-4 font-mono text-xs shadow-xl animate-fade-in">
                <div className="flex items-center gap-2 text-white">
                  <CheckSquare className="w-4 h-4 text-red-400" />
                  <span className="font-bold">{selectedSessionIds.length} Sessions Selected</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('CONFIRMED_FRAUD')}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors"
                  >
                    Bulk Confirm Fraud
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('CONFIRMED_LEGITIMATE')}
                    className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                  >
                    Bulk Confirm Legit
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('IN_REVIEW')}
                    className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] transition-colors"
                  >
                    Flag In Review
                  </button>
                  <button
                    onClick={() => setSelectedSessionIds([])}
                    className="px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="cyber-card rounded-xl border-[#1E2631] overflow-x-auto shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111418] border-b border-[#1E2631] text-[10px] text-gray-400 uppercase">
                    <th className="p-3.5 w-10 text-center">
                      <button onClick={handleToggleSelectAll} className="focus:outline-none">
                        {selectedSessionIds.length === sessions.length && sessions.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-red-400" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Session ID</th>
                    <th className="p-3.5">Customer Ref</th>
                    <th className="p-3.5 text-center">Score</th>
                    <th className="p-3.5">Risk Tier</th>
                    <th className="p-3.5">Top Behavioral Signal</th>
                    <th className="p-3.5">Case Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2631]/60">
                  {sessions.map((sess, idx) => {
                    const isSelected = selectedSessionIds.includes(sess.id);
                    const isHighlighted = highlightedRowIndex === idx;

                    return (
                      <tr
                        key={sess.id}
                        onClick={() => setSelectedSession(sess)}
                        className={`cursor-pointer transition-colors ${
                          isHighlighted
                            ? 'bg-red-950/40 border-l-4 border-l-red-500'
                            : isSelected
                            ? 'bg-red-950/20'
                            : 'hover:bg-red-950/20'
                        }`}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => handleToggleSelectSession(sess.id, e)}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-400 inline" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-600 hover:text-gray-400 inline" />
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          {sess.sessionId}
                        </td>
                        <td className="p-3.5 text-gray-300">{sess.customerReference}</td>
                        <td className="p-3.5 text-center font-bold text-red-400">{sess.riskScore}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded border text-[10px] ${getTierBadge(sess.riskTier)}`}>
                            {sess.riskTier}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-200">{sess.topSignal}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded border text-[10px] ${getStatusBadge(sess.status)}`}>
                            {sess.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button className="px-3 py-1 bg-[#0B0D10] hover:bg-red-600 hover:text-white border border-[#1E2631] rounded text-[11px] text-gray-300 transition-colors">
                            Investigate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="p-3.5 bg-[#111418] border-t border-[#1E2631] flex items-center justify-between text-gray-400 text-[11px]">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded bg-[#0B0D10] border border-[#1E2631] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded bg-[#0B0D10] border border-[#1E2631] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODEL HEALTH */}
        {activeTab === 'health' && <ModelHealthPanel />}

        {/* TAB 3: PUBLIC REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase">Submitted Incident Reports ({reports.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((rep) => (
                <div key={rep.id} className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rep.reporterName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      {rep.fraudType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed">{rep.description}</p>

                  {rep.evidence && (
                    <div className="p-2 rounded bg-[#0B0D10] border border-[#1E2631] text-[10px] text-gray-400">
                      <strong>Evidence:</strong> {rep.evidence}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-[#1E2631]">
                    <span>{rep.reporterEmail}</span>
                    <span className="text-emerald-400 font-bold">{rep.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Session Investigation Drawer */}
      <SessionDrawer
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onSessionUpdated={handleSessionUpdated}
      />

      <Footer />
    </div>
  );
};
