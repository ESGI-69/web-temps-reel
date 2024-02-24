import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useQuestionStore = defineStore({
  id: 'questionStore',
  state: () => ({
    questionsByQuizz: [],

    isQuestionsByQuizzLoading: false,
    isQuestionPostLoading: false,
    isDeleteQuestionLoading: false,
  }),
  actions: {
    async getQuestionsByQuizz(quizzId) {
      this.isQuestionsByQuizzLoading = true;
      try {
        const { data } = await api.get(`/question?quizzId=${quizzId}`);
        this.questionsByQuizz = data;
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isQuestionsByQuizzLoading = false;
    },

    async postQuestion({ title, options, answer, quizzId }) {
      this.isQuestionPostLoading = true;
      try {
        const { data } = await api.post('/question', {
          title,
          options,
          quizzId,
          answer,
        });
        this.questionsByQuizz.push(data);
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isQuestionPostLoading = false;
    },

    async deleteQuestion(id) {
      this.isDeleteQuestionLoading = true;
      try {
        await api.delete(`/question/${id}`);
        this.questionsByQuizz = this.questionsByQuizz.filter(
          (question) => question.id !== id,
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
      this.isDeleteQuestionLoading = false;
    },
  },
});
