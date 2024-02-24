<template>
  <main>
    <h2>ROOM creator</h2>
    <ConnectionState />
    <p>Current room : {{ roomStore.roomName }} - {{ roomStore.roomId }}</p>
    <MyForm @submit="createRoom" />
  </main>
</template>

<script setup>
import { onUnmounted } from 'vue';
import MyForm from '@/components/MyForm.vue';
import ConnectionState from '@/components/ConnectionState.vue';

import { socket } from '@/socket.js';
import { useRouter } from 'vue-router';
import { useRoomStore } from '@/stores/roomStore.js';
import { useQuizzStore } from '@/stores/quizzStore';

const quizzStore = useQuizzStore();

quizzStore.getAllQuizzes();

const roomStore = useRoomStore();
const router = useRouter();

const createRoom = (room) => {
  if ( room.name ) {
    socket.emit('joinRoom', room);
    socket.emit('getRoomUsers', room.name);
  }
};

const onRoomJoined = (roomObject) => {
  roomStore.setRoomId(roomObject.id);
  roomStore.setRoomName(roomObject.name);
  roomStore.setRoomQuizz(roomObject.quizz);
  router.push(`/room/${roomObject.id}`);
};
socket.on('roomJoined', onRoomJoined);

onUnmounted(() => {
  socket.off('roomJoined', onRoomJoined);
});
</script>
