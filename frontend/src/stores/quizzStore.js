import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useQuizzStore = defineStore({
  id: 'quizzStore',
  state: () => ({
    quizz: null,
    quizzes: [],

    isQuizzesLoading: false,
    isQuizzLoadging: false,
    isPostQuizzLoading: false,
    isPatchQuizzLoading: false,
    isDeleteQuizzLoading: false,
  }),
  actions: {
    async getAllQuizzes() {
      this.isQuizzesLoading = true;
      try {
        const { data } = await api.get('/quizz');
        this.quizzes = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isQuizzesLoading = false;
    },

    async getQuizz(id) {
      this.isQuizzLoadging = true;
      try {
        const { data } = await api.get(`/quizz/${id}`);
        this.quizz = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isQuizzLoadging = false;
    },

    async postQuizz({ title, description }) {
      this.isPostQuizzLoading = true;
      try {
        const { data } = await api.post('/quizz', { title, description });
        this.quizzes.push(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isPostQuizzLoading = false;
    },

    async patchQuizz({ id, title, description }) {
      this.isPatchQuizzLoading = true;
      try {
        const { data } = await api.patch(`/quizz/${id}`, {
          title,
          description,
        });
        this.quizzes = this.quizzes.map((quizz) =>
          quizz.id === id ? data : quizz,
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isPatchQuizzLoading = false;
    },

    async deleteQuizz(id) {
      this.isDeleteQuizzLoading = true;
      try {
        await api.delete(`/quizz/${id}`);
        this.quizzes = this.quizzes.filter((quizz) => quizz.id !== id);
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isDeleteQuizzLoading = false;
    },
  },
});
