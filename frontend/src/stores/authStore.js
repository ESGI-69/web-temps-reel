import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    profile: null,
  }),
  getters: {
    isLogged() {
      return !!this.profile;
    },
  },
  actions: {
    async getProfile() {
      try {
        const { data } = await api.get('/user/me');
        this.profile = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async login({ username, password }) {
      try {
        const { data } = await api.post('/login', { username, password });
        Cookies.set(import.meta.env.VITE_COOKIE_TOKEN_NAME, data.token);
        await this.getProfile();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      Cookies.remove(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      this.profile = null;
      window.location.reload();
    },

    init() {
      const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      if (token) {
        this.getProfile();
      }
    },
  },
});
