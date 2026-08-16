import { apiFetch } from './client';
import { User } from '../types';

export const userApi = {
  getUsers: () => apiFetch<User[]>('/users'),

  updateUser: (id: string, data: { role?: string; isActive?: boolean }) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    apiFetch<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};
