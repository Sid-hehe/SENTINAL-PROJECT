import { apiFetch } from './client';
import { AuditLog } from '../types';

export const auditApi = {
  getAuditLogs: (params?: { action?: string; entityType?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.action) query.append('action', params.action);
    if (params?.entityType) query.append('entityType', params.entityType);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<AuditLog[]>(`/audit-logs${queryString}`);
  },
};
