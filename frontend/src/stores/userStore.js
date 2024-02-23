import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    isPostUserLoading: false,
  }),
  actions: {
    async postUser({ username, password }) {
      this.isPostUserLoading = true;
      try {
        await api.post('/user', { username, password });
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.isPostUserLoading = false;
      }
    },
  },
});
