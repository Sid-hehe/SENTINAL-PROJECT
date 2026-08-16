import { ApiResponse } from '../types';

// In production (Vercel), VITE_API_URL points to the Render backend.
// In local development, it falls back to the Vite proxy at /api.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: 'include', // Include HTTP-only cookies
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: 'HTTP_ERROR',
          message: `Request failed with status ${response.status}`,
        },
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Unable to connect to Sentinel API server',
      },
    };
  }
}
