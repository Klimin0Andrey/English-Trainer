import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../api/auth';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        const email = localStorage.getItem('user_email');

        if (token && userId && email) {
          setUser({
            access_token: token,
            token_type: 'bearer',
            user_id: parseInt(userId, 10),
            email,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_id', String(response.user_id));
    localStorage.setItem('user_email', response.email);

    setUser(response);
  };

  const register = async (email: string, password: string) => {
    await authApi.register({ email, password });
    await login(email, password);
  };

  const logout = () => {
    authApi.logout();

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};