import { writable } from 'svelte/store';
import { apiClient } from '../utils/apiClient.js';

function createGroupStore() {
  const { subscribe, set, update } = writable({
    currentGroup: null,
    loading: false,
    error: null,
  });

  return {
    subscribe,
    createGroup: async (groupData) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const group = await apiClient.post('/groups', groupData);
        update((state) => ({ ...state, currentGroup: group, loading: false }));
        return group;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    joinGroup: async (token) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const group = await apiClient.post(`/groups/join/${token}`);
        update((state) => ({ ...state, currentGroup: group, loading: false }));
        return group;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    fetchGroup: async (id) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const group = await apiClient.get(`/groups/${id}`);
        update((state) => ({ ...state, currentGroup: group, loading: false }));
        return group;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    clearGroup: () => set({ currentGroup: null, loading: false, error: null }),
  };
}

export const groupStore = createGroupStore();