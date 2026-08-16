import { apiFetch } from './client';
import { Session, BehavioralSignal, CaseNote } from '../types';

export interface SessionsResponse {
  sessions: Session[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sessionApi = {
  getSessions: (params?: {
    riskTier?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.riskTier) query.append('riskTier', params.riskTier);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<SessionsResponse>(`/sessions${queryString}`);
  },

  getSessionById: (id: string) => apiFetch<Session>(`/sessions/${id}`),

  updateSessionStatus: (id: string, status: string) =>
    apiFetch<Session>(`/sessions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getSignals: (id: string) => apiFetch<BehavioralSignal[]>(`/sessions/${id}/signals`),

  getNotes: (id: string) => apiFetch<CaseNote[]>(`/sessions/${id}/notes`),

  addNote: (id: string, content: string) =>
    apiFetch<CaseNote>(`/sessions/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  updateBatchStatus: async (ids: string[], status: string) => {
    const results = await Promise.all(
      ids.map((id) =>
        apiFetch<Session>(`/sessions/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
      )
    );
    return results;
  },

  simulateSession: (scenarioType: string = 'ACCOUNT_TAKEOVER') =>
    apiFetch<Session>('/sessions/simulate', {
      method: 'POST',
      body: JSON.stringify({ scenarioType }),
    }),
};
