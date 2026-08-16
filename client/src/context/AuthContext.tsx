import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAnalyst: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoAccount: (role: Role) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_ROLE_KEY = 'sentinel_active_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const fetchUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, res.data.user.role);
      } else {
        // Attempt automatic login using saved demo role if unauthenticated on refresh
        const savedRole = (localStorage.getItem(LOCAL_STORAGE_ROLE_KEY) as Role) || 'ANALYST';
        const demoCredentials = {
          ADMIN: { email: 'admin@sentinel.demo', pass: 'SentinelDemo123!' },
          ANALYST: { email: 'analyst@sentinel.demo', pass: 'SentinelDemo123!' },
          USER: { email: 'user@sentinel.demo', pass: 'SentinelDemo123!' },
        };
        const creds = demoCredentials[savedRole] || demoCredentials.ANALYST;
        const loginRes = await authApi.login({ email: creds.email, password: creds.pass });
        if (loginRes.success && loginRes.data?.user) {
          setUser(loginRes.data.user);
          localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, loginRes.data.user.role);
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, res.data.user.role);
        toast.success(`Welcome, ${res.data.user.name}`, `Authenticated as ${res.data.user.role}`);
        return true;
      } else {
        toast.error('Authentication Failed', res.error?.message || 'Invalid credentials');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, res.data.user.role);
        toast.success('Account Created', `Registered successfully as ${res.data.user.role}`);
        return true;
      } else {
        toast.error('Registration Failed', res.error?.message || 'Failed to create account');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_ROLE_KEY);
    toast.info('Logged Out', 'Your session has ended.');
  };

  const switchDemoAccount = async (targetRole: Role): Promise<boolean> => {
    const demoCredentials = {
      ADMIN: { email: 'admin@sentinel.demo', pass: 'SentinelDemo123!' },
      ANALYST: { email: 'analyst@sentinel.demo', pass: 'SentinelDemo123!' },
      USER: { email: 'user@sentinel.demo', pass: 'SentinelDemo123!' },
    };

    const target = demoCredentials[targetRole];
    const ok = await login(target.email, target.pass);
    if (ok) {
      localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, targetRole);
    }
    return ok;
  };

  const isAuthenticated = !!user;
  const isAnalyst = user?.role === 'ANALYST' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAnalyst,
        isAdmin,
        login,
        register,
        logout,
        switchDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
