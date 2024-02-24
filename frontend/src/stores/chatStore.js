import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useUserStore = defineStore({
  id: 'chatStore',
  state: () => ({
    isChatMessagesLoading: false,
    isChatMessageSentLoading: false,
    chatMessages: [],
  }),
  actions: {
    async sendMessage(data) {
      this.isChatMessageSentLoading = true;
      //todo: send message to the server (api call, check si l'user à le droit de poster un message dans l'endpoint)
      //Enverra un message dans le chat de la room de l'user
      try {
        await api.post('/chat', data);
      } catch (error) {
        console.error(error);
      } finally {
        this.isChatMessageSentLoading = false;
      }

    },
    async getMessages() {
      this.isChatMessagesLoading = true;
      //   this.chatMessages = this.chatMessages; //todo au final on va pas utiliser l'api XD
      this.isChatMessagesLoading = false;
    },
  },
});
