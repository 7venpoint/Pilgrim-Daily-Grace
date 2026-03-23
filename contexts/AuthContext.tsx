import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { getApiUrl } from '@/lib/query-client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthUrl(path: string): string {
  const base = getApiUrl();
  return `${base}${path}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(getAuthUrl('/api/auth/user'), {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    const loginUrl = getAuthUrl('/api/auth/login');
    if (Platform.OS === 'web') {
      window.location.href = loginUrl;
    } else {
      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        getApiUrl()
      );
      if (result.type === 'success') {
        await fetchUser();
      }
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        window.location.href = getAuthUrl('/api/auth/logout');
      } else {
        await fetch(getAuthUrl('/api/auth/logout'), { credentials: 'include' });
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
