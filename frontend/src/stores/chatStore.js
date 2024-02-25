import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useChatStore = defineStore({
  id: 'chatStore',
  state: () => ({
    isChatMessagesLoading: false,
    isChatMessageSentLoading: false,
    chatMessages: [],
  }),
  actions: {
    async sendMessage(data) {
      this.isChatMessageSentLoading = true;
      try {
        await api.post('/chat', data);
      } catch (error) {
        console.error(error);
      } finally {
        this.isChatMessageSentLoading = false;
      }
    },
    async addMessage(data) {
      this.chatMessages.push(data);
    },
  },
});
