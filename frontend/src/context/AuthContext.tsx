import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: any) => Promise<void>;
  logout: () => void;
  demoLogin: (role: 'student' | 'owner' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('staywise_token');
    if (token) {
      api.getCurrentUser()
        .then(u => setUser(u))
        .catch(() => {
          localStorage.removeItem('staywise_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
  };

  const register = async (params: any) => {
    const res = await api.register(params);
    setUser(res.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const demoLogin = async (role: 'student' | 'owner' | 'admin') => {
    let email = 'student.sandesh@staywise.com';
    if (role === 'owner') email = 'owner.suresh@staywise.com';
    if (role === 'admin') email = 'admin@staywise.com';

    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
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
