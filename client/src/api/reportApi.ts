import { apiFetch } from './client';
import { SuspiciousReport } from '../types';

export const reportApi = {
  submitReport: (data: {
    reporterName: string;
    reporterEmail: string;
    fraudType: string;
    description: string;
    suspectedPattern?: string;
    evidence?: string;
  }) =>
    apiFetch<{ report: SuspiciousReport; message: string }>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getReports: (params?: { status?: string; fraudType?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.fraudType) query.append('fraudType', params.fraudType);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<SuspiciousReport[]>(`/reports${queryString}`);
  },

  getReportById: (id: string) => apiFetch<SuspiciousReport>(`/reports/${id}`),

  updateReportStatus: (id: string, status: string) =>
    apiFetch<SuspiciousReport>(`/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
