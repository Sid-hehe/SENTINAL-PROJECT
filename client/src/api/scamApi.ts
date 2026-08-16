import { apiFetch } from './client';
import { ScamPattern } from '../types';

export const scamApi = {
  getScams: (params?: { search?: string; riskTier?: string; fraudType?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.riskTier) query.append('riskTier', params.riskTier);
    if (params?.fraudType) query.append('fraudType', params.fraudType);
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<ScamPattern[]>(`/scams${queryString}`);
  },

  getScamById: (id: string) => apiFetch<ScamPattern>(`/scams/${id}`),

  createScam: (data: Partial<ScamPattern>) =>
    apiFetch<ScamPattern>('/scams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateScam: (id: string, data: Partial<ScamPattern>) =>
    apiFetch<ScamPattern>(`/scams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteScam: (id: string) =>
    apiFetch<{ message: string }>(`/scams/${id}`, {
      method: 'DELETE',
    }),
};
