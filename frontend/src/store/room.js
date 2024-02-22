import { defineStore } from 'pinia';

export const useRoomStore = defineStore({
  id: 'room',
  state: () => ({
    roomId: null,
    roomName:null,
  }),
  actions: {
    setRoomId(roomId) {
      this.roomId = roomId;
    },
    setRoomName(roomName) {
      this.roomName = roomName;
    },
  },
});
