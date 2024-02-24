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
          {{ user }}
        </li>
      </ul>
    </template>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/stores/roomStore.js';
import { onMounted } from 'vue';
import { socket, connect } from '@/socket.js';

const roomStore = useRoomStore();
const route = useRoute();

const { room, isRoomLoading } = storeToRefs(roomStore);

onMounted(async () => {
  await connect();
  await roomStore.getRoom(route.params.id);
  console.log(room);

  // socket.on('roomUsers', (newUsers) => {
  //   roomStore.setUsers(newUsers);
  // });
});
</script>
