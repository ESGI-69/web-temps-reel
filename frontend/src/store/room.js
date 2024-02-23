import { defineStore } from 'pinia';

export const useRoomStore = defineStore({
  id: 'room',
  state: () => ({
    roomId: null,
    roomName:null,
    users: {},
  }),
  actions: {
    setRoomId(roomId) {
      this.roomId = roomId;
    },
    setRoomName(roomName) {
      this.roomName = roomName;
    },
    setUsers(users) {
      this.users = users;
    },
  },
});
