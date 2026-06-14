import { writable } from 'svelte/store';
import { apiClient } from '../utils/apiClient.js';

function createTeamStore() {
  const { subscribe, set, update } = writable({
    auctions: [],
    myTeams: [],
    loading: false,
    error: null,
  });

  return {
    subscribe,
    fetchAuctions: async (groupId) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const auctions = await apiClient.get(`/groups/${groupId}/auctions`);
        update((state) => ({ ...state, auctions, loading: false }));
        return auctions;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    placeBid: async (playerId, groupId, bidAmount) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const newBid = await apiClient.post(`/auctions/${playerId}/bid`, { groupId, bidAmount });
        update((state) => ({ ...state, loading: false }));
        return newBid;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    fetchMyTeams: async (groupId = null) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const query = groupId ? `?groupId=${groupId}` : '';
        const myTeams = await apiClient.get(`/teams/me${query}`);
        update((state) => ({ ...state, myTeams, loading: false }));
        return myTeams;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    saveTeam: async (teamData) => {
      update((state) => ({ ...state, loading: true, error: null }));
      try {
        const team = await apiClient.post('/teams', teamData);
        update((state) => ({ ...state, loading: false }));
        return team;
      } catch (error) {
        update((state) => ({ ...state, error: error.message, loading: false }));
        throw error;
      }
    },
    clearError: () => update((state) => ({ ...state, error: null })),
  };
}

export const teamStore = createTeamStore();