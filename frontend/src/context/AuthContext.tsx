import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('bookstore_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('bookstore_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authApi.login(credentials);
      localStorage.setItem('bookstore_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authApi.register(data);
      localStorage.setItem('bookstore_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    localStorage.removeItem('bookstore_user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    const updatedUser = await authApi.updateProfile(state.user.id, data);
    localStorage.setItem('bookstore_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
