<template>
  <p>Real time connection: {{ connected ? 'connected' : 'disconnected' }}</p>
</template>

<script setup>
import { state } from '@/socket';
import { computed } from 'vue'; // Importez computed de vue, pas de Vue.

const connected = computed(() => state.connected);
</script>


