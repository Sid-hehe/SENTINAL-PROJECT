import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { userApi } from '../api/userApi';
import { auditApi } from '../api/auditApi';
import { scamApi } from '../api/scamApi';
import { reportApi } from '../api/reportApi';
import { User, AuditLog, ScamPattern, SuspiciousReport } from '../types';
import { useToast } from '../context/ToastContext';
import { Users, Shield, FileText, Activity, Trash2, Edit, Plus, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<'users' | 'scams' | 'reports' | 'audit'>('users');
  const toast = useToast();

  // Admin Data States
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [scams, setScams] = useState<ScamPattern[]>([]);
  const [reports, setReports] = useState<SuspiciousReport[]>([]);
  const [loading, setLoading] = useState(true);

  // New Scam Modal Form
  const [showCreateScam, setShowCreateScam] = useState(false);
  const [newScamTitle, setNewScamTitle] = useState('');
  const [newScamDesc, setNewScamDesc] = useState('');
  const [newScamDetail, setNewScamDetail] = useState('');
  const [newScamType, setNewScamType] = useState('ACCOUNT_TAKEOVER');
  const [newScamTier, setNewScamTier] = useState('HIGH');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, aRes, sRes, rRes] = await Promise.all([
        userApi.getUsers(),
        auditApi.getAuditLogs(),
        scamApi.getScams(),
        reportApi.getReports(),
      ]);

      if (uRes.success && uRes.data) setUsers(uRes.data);
      if (aRes.success && aRes.data) setAuditLogs(aRes.data);
      if (sRes.success && sRes.data) setScams(sRes.data);
      if (rRes.success && rRes.data) setReports(rRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    const res = await userApi.updateUser(id, { role: newRole });
    if (res.success && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      toast.success('User Role Updated', `Role changed to ${newRole}`);
    } else {
      toast.error('Update Failed', res.error?.message);
    }
  };

  const handleToggleUserActive = async (id: string, currentActive: boolean) => {
    const res = await userApi.updateUser(id, { isActive: !currentActive });
    if (res.success && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      toast.success(
        'User Status Updated',
        `User account ${!currentActive ? 'activated' : 'deactivated'}`
      );
    } else {
      toast.error('Update Failed', res.error?.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await userApi.deleteUser(id);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('User Deleted', 'Account permanently removed');
    } else {
      toast.error('Delete Failed', res.error?.message);
    }
  };

  const handleCreateScam = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await scamApi.createScam({
      title: newScamTitle,
      description: newScamDesc,
      detailedDescription: newScamDetail,
      fraudType: newScamType as any,
      riskTier: newScamTier as any,
      behavioralRedFlags: ['Sudden IP geolocation shift', '0ms typing delay'],
      protectionTips: ['Enforce biometric passkey re-authentication'],
      exampleRiskScore: 85,
    });

    if (res.success && res.data) {
      setScams((prev) => [res.data!, ...prev]);
      setShowCreateScam(false);
      setNewScamTitle('');
      setNewScamDesc('');
      setNewScamDetail('');
      toast.success('Scam Pattern Created', 'New threat pattern added to registry');
    } else {
      toast.error('Creation Failed', res.error?.message);
    }
  };

  const handleDeleteScam = async (id: string) => {
    if (!window.confirm('Delete this scam pattern?')) return;
    const res = await scamApi.deleteScam(id);
    if (res.success) {
      setScams((prev) => prev.filter((s) => s.id !== id));
      toast.success('Pattern Deleted', 'Scam pattern removed');
    }
  };

  const handleUpdateReportStatus = async (id: string, newStatus: string) => {
    const res = await reportApi.updateReportStatus(id, newStatus);
    if (res.success && res.data) {
      setReports((prev) => prev.map((r) => (r.id === id ? res.data! : r)));
      toast.success('Report Status Updated', `Marked as ${newStatus}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2631] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-400 tracking-wider">ADMINISTRATIVE COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              System Administration
            </h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-3 py-1.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Admin Data</span>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="border-b border-[#1E2631] flex flex-wrap gap-4 font-mono text-xs">
          <button
            onClick={() => setActiveSection('users')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeSection === 'users' ? 'text-amber-400 border-amber-500' : 'text-gray-400 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('scams')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeSection === 'scams' ? 'text-amber-400 border-amber-500' : 'text-gray-400 border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Scam Patterns ({scams.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeSection === 'reports' ? 'text-amber-400 border-amber-500' : 'text-gray-400 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Submitted Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('audit')}
            className={`pb-3 px-1 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeSection === 'audit' ? 'text-amber-400 border-amber-500' : 'text-gray-400 border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* SECTION 1: USERS */}
        {activeSection === 'users' && (
          <div className="cyber-card rounded-xl border-[#1E2631] overflow-x-auto shadow-2xl font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111418] border-b border-[#1E2631] text-[10px] text-gray-400 uppercase">
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Login</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2631]/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/40">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-[10px]">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 text-gray-300">{u.email}</td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                        className="bg-[#0B0D10] border border-[#1E2631] rounded px-2 py-1 text-gray-200 text-xs font-mono"
                      >
                        <option value="USER">USER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          u.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {u.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserActive(u.id, u.isActive ?? true)}
                        className="px-2.5 py-1 rounded bg-[#0B0D10] border border-[#1E2631] text-gray-300 hover:text-white"
                      >
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === currentUser?.id}
                        className="p-1 rounded text-red-400 hover:bg-red-950 border border-transparent hover:border-red-800 disabled:opacity-30"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 2: SCAMS */}
        {activeSection === 'scams' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#111418] p-4 rounded-xl border border-[#1E2631]">
              <span className="font-bold text-white">SCAM PATTERNS REGISTRY ({scams.length})</span>
              <button
                onClick={() => setShowCreateScam(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Pattern</span>
              </button>
            </div>

            {/* Create Scam Modal */}
            {showCreateScam && (
              <form onSubmit={handleCreateScam} className="cyber-card p-6 rounded-xl border-red-900/40 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase">Register New Fraud Pattern</h3>
                <input
                  type="text"
                  required
                  value={newScamTitle}
                  onChange={(e) => setNewScamTitle(e.target.value)}
                  placeholder="Pattern Title (e.g. SIM Swap Cash-Out)"
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded p-2.5 text-white"
                />
                <input
                  type="text"
                  required
                  value={newScamDesc}
                  onChange={(e) => setNewScamDesc(e.target.value)}
                  placeholder="Short Description"
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded p-2.5 text-white"
                />
                <textarea
                  rows={3}
                  required
                  value={newScamDetail}
                  onChange={(e) => setNewScamDetail(e.target.value)}
                  placeholder="Detailed Technical Description & Attack Flow..."
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded p-2.5 text-white"
                ></textarea>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newScamType}
                    onChange={(e) => setNewScamType(e.target.value)}
                    className="bg-[#0B0D10] border border-[#1E2631] rounded p-2.5 text-gray-200"
                  >
                    <option value="ACCOUNT_TAKEOVER">ACCOUNT_TAKEOVER</option>
                    <option value="ONBOARDING_FRAUD">ONBOARDING_FRAUD</option>
                    <option value="IDENTITY_THEFT">IDENTITY_THEFT</option>
                    <option value="DEVICE_FRAUD">DEVICE_FRAUD</option>
                  </select>

                  <select
                    value={newScamTier}
                    onChange={(e) => setNewScamTier(e.target.value)}
                    className="bg-[#0B0D10] border border-[#1E2631] rounded p-2.5 text-gray-200"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateScam(false)}
                    className="px-4 py-2 rounded bg-gray-800 text-gray-300"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white font-bold">
                    Save Pattern
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scams.map((s) => (
                <div key={s.id} className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">{s.title}</h4>
                    <button onClick={() => handleDeleteScam(s.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-sans">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: REPORTS */}
        {activeSection === 'reports' && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase">Public Reports Triage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r) => (
                <div key={r.id} className="cyber-card p-5 rounded-xl border-[#1E2631] space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{r.reporterName}</span>
                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateReportStatus(r.id, e.target.value)}
                      className="bg-[#0B0D10] border border-[#1E2631] rounded px-2 py-0.5 text-xs text-amber-400"
                    >
                      <option value="NEW">NEW</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DISMISSED">DISMISSED</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-300 font-sans">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: AUDIT LOGS */}
        {activeSection === 'audit' && (
          <div className="cyber-card rounded-xl border-[#1E2631] overflow-x-auto shadow-2xl font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111418] border-b border-[#1E2631] text-[10px] text-gray-400 uppercase">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">Metadata / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2631]/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/40">
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-red-400 font-bold">{log.user?.name || 'System'}</td>
                    <td className="p-3.5 font-bold text-white">{log.action}</td>
                    <td className="p-3.5 text-gray-300">
                      {log.entityType} ({log.entityId || 'N/A'})
                    </td>
                    <td className="p-3.5 text-gray-400 text-[11px] max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
