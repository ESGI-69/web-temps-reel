import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/authStore';

/**
 * Intercept all requests and add the Authorization header if the user is logged in
 * @param axios { import('axios').AxiosInstance } Axios instance
 * @param router { import('vue-router').Router } Vue router instance
 */
export default (axios, router) => {
  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        useAuthStore().logout();
        router.push({ name: 'login' });
      }
      return Promise.reject(error);
    },
  );
};
