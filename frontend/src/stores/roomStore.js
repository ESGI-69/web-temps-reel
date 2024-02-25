import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useRoomStore = defineStore({
  id: 'room',
  state: () => ({
    room: {},

    isRoomsLoading: false,
    isRoomLoading: false,
    isPostRoomLoading: false,
    isPatchRoomLoading: false,
    isDeleteRoomLoading: false,
  }),
  actions: {
    async createRoom(room) {
      this.isPostRoomLoading = true;
      try {
        const { data } = await api.post('/room', room);
        this.room = data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.isPostRoomLoading = false;
      }
    },
    async getRooms() {
      this.isRoomsLoading = true;
      try {
        const { data } = await api.get('/room');
        this.rooms = data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.isRoomsLoading = false;
      }
    },
    async getRoom(id) {
      this.isRoomLoading = true;
      try {
        const { data } = await api.get(`/room/${id}`);
        this.room = data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.isRoomLoading = false;
      }
    },
    async joinRoom(id) {
      this.isRoomLoading = true;
      try {
        const { data } = await api.get(`/room/${id}/join`);
        this.room = data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.isRoomLoading = false;
      }
    },
  },
});
