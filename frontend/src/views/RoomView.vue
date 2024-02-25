<template>
  <main>
    <h2>ROOM view</h2>
    <template v-if="isRoomLoading">
      <p>Loading room...</p>
    </template>
    <template v-else>
      <p>Current room: {{ room.name }} - {{ room.id }}</p>
      <ConnectionState />

      <!-- <p>Quizz: {{ roomStore.room.title }}</p> -->

      <p>Users in the room:</p>
      <ul v-if="room.players">
        <li
          v-for="user in room.players"
          :key="user"
        >
          {{ user.username }}
        </li>
      </ul>
    </template>
    <button
      @click="leaveRoom()"
    >
      Leave room
    </button>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/stores/roomStore.js';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';
import { socket, connect } from '@/socket.js';

const roomStore = useRoomStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { room, isRoomLoading } = storeToRefs(roomStore);
const { profile } = storeToRefs(authStore);

onMounted(async () => {
  await connect();
  await roomStore.getRoom(route.params.id);
  if (!room.value.players.map((player) => player.id).includes(profile.value.id)) {
    router.push({ name: 'home' });
  }
});

const leaveRoom = async () => {
  await roomStore.leaveRoom();
  socket.disconnect();
  router.push({ name: 'home' });
};

socket.on('roomUpdated', (roomUpdated) => {
  roomStore.updateRoomState(roomUpdated);
});
</script>
