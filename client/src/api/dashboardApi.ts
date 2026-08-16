import { apiFetch } from './client';
import { DashboardStats, ModelHealthData } from '../types';

export const dashboardApi = {
  getStats: () => apiFetch<DashboardStats>('/dashboard/stats'),

  getTrends: () =>
    apiFetch<{
      riskDistribution: Array<{ name: string; count: number; color: string }>;
      fraudTrend: Array<{ day: string; totalSessions: number; flaggedAnomalies: number; confirmedFraud: number }>;
      signalFrequency: Array<{ name: string; count: number }>;
      detectionPerformance: Array<{ category: string; preTransaction: number; postTransaction: number }>;
    }>('/dashboard/trends'),

  getModelHealth: () => apiFetch<ModelHealthData>('/dashboard/model-health'),

  toggleModelHealth: (enabled?: boolean) =>
    apiFetch<ModelHealthData>('/dashboard/model-health/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    }),
};
