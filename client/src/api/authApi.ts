import { apiFetch } from './client';
import { User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiFetch<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiFetch<{ user: User }>('/auth/me'),
};
