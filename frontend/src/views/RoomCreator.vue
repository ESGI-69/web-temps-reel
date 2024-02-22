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
import { useRoomStore } from '@/store/room.js';

const roomStore = useRoomStore();
const router = useRouter();

const createRoom = (roomName) => {
  socket.emit('joinRoom', roomName);
};

const onRoomJoined = (roomObject) => {
  roomStore.setRoomId(roomObject.id);
  roomStore.setRoomName(roomObject.name);
  router.push(`/room/${roomObject.id}`);
};
socket.on('roomJoined', onRoomJoined);

onUnmounted(() => {
  socket.off('roomJoined', onRoomJoined);
});
</script>
