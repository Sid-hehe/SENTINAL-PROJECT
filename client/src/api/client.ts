import { ApiResponse } from '../types';

// In production, default directly to the Render backend if VITE_API_URL is not set
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://sentinal-project-95qe.onrender.com/api' : '/api');

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
    const text = await response.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: { code: 'PARSE_ERROR', message: text || `HTTP ${response.status}` } };
    }

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
