<template>
  <main>
    <h2>ROOM view</h2>
    <p>Current room : {{ roomStore.roomName }} - {{ roomStore.roomId }}</p>
    <ConnectionState />
  </main>
</template>

<script setup>
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/store/room.js';

const roomStore = useRoomStore();
</script>
