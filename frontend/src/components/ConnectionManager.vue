<template>
  <button @click="connect()">
    Connect
  </button>
  <button @click="disconnect()">
    Disconnect
  </button>
</template>

<script setup>
import { socket } from '@/socket';

const connect = () => {
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
};
</script>
