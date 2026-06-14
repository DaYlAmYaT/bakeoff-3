import { writable } from 'svelte/store';
import { apiClient } from '../utils/apiClient.js';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

function createAuthStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    login: async (credentials) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const data = await apiClient.post('/auth/login', credentials);
        localStorage.setItem('token', data.token);
        update((state) => ({
          ...state,
          user: data,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        }));
        return data;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    register: async (userData) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const data = await apiClient.post('/auth/register', userData);
        localStorage.setItem('token', data.token);
        update((state) => ({
          ...state,
          user: data,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        }));
        return data;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ ...initialState, token: null, isAuthenticated: false });
    },
    fetchUser: async () => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const user = await apiClient.get('/users/me');
        update((state) => ({ ...state, user, isAuthenticated: true, loading: false }));
      } catch (error) {
        localStorage.removeItem('token');
        update((state) => ({ ...state, error: error.message, user: null, token: null, isAuthenticated: false, loading: false }));
      }
    },
  };
}

export const authStore = createAuthStore();