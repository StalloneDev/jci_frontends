import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;

          // Set token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({ token, user, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },

      register: async (data: any) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/auth/register', data);
          const { token, user } = response.data;

          // Set token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({ token, user, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },

      logout: () => {
        // Remove token from axios defaults
        delete api.defaults.headers.common['Authorization'];

        set({ token: null, user: null });
      },

      updateUser: async (data: Partial<User>) => {
        try {
          set({ loading: true, error: null });
          const response = await api.patch('/auth/profile', data);
          set({ user: response.data, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },

      updatePassword: async (oldPassword: string, newPassword: string) => {
        try {
          set({ loading: true, error: null });
          await api.patch('/auth/password', { oldPassword, newPassword });
          set({ loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          await api.post('/auth/forgot-password', { email });
          set({ loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },

      resetPassword: async (token: string, password: string) => {
        try {
          set({ loading: true, error: null });
          await api.post('/auth/reset-password', { token, password });
          set({ loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Une erreur est survenue',
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
