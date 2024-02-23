import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useQuizzStore = defineStore({
  id: 'quizzStore',
  state: () => ({
    quizz: null,
    quizzes: [],

    isQuizzesLoading: false,
    isPostQuizzLoading: false,
  }),
  actions : {
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
  },
});
