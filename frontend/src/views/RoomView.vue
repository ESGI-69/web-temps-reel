<template>
  <main>
    <h2>ROOM view</h2>
    <p>Current room: {{ roomStore.roomName }} - {{ roomStore.roomId }}</p>
    <ConnectionState />

    Users in the room:
    <ul>
      <li
        v-for="user in roomStore.users"
        :key="user"
      >
        {{ user }}
      </li>
    </ul>
  </main>
</template>

<script setup>
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/stores/roomStore.js';
import { onMounted } from 'vue';
import { socket } from '@/socket.js';

const roomStore = useRoomStore();

onMounted(() => {
  socket.on('roomUsers', (newUsers) => {
    roomStore.setUsers(newUsers);
  });
});
</script>
