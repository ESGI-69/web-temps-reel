import { defineStore } from 'pinia';

export const useRoomStore = defineStore({
  id: 'room',
  state: () => ({
    roomId: null,
    roomName:null,
    roomQuizz: null,
    createdBy: null,
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
    setRoomQuizz(quizz) {
      this.roomQuizz = quizz;
    },
    setCreatedBy(createdBy) {
      this.createdBy = createdBy;
    },
  },
});
