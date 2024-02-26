<template>
  <main>
    <RouterLink
      v-if="!isLogged"
      to="/login"
    >
      Login
    </RouterLink>
    <RouterLink
      v-if="!isLogged"
      to="/register"
    >
      Register
    </RouterLink>
    <a
      v-if="isLogged"
      @click="authStore.logout"
    >
      Logout
    </a>
    <RouterLink
      v-if="isAdmin"
      to="/admin"
    >
      Admin
    </RouterLink>
    <RouterLink
      v-if="isLogged && !isQuizzesLoading && quizzes.length > 0 && !profile.currentRoom"
      to="/room"
    >
      Create a room
    </RouterLink>
    <JoinRoom
      v-if="isLogged && !profile.currentRoom"
    />
    <button
      v-if="isLogged && profile.currentRoom"
      @click="leaveRoom()"
    >
      Leave room {{ profile.currentRoom.id }}
    </button>
    <span v-if="!isQuizzesLoading && quizzes.length === 0">
      ⚠️⚠️⚠️ No quizzes found, ask an admin to add some before creating a room ⚠️⚠️⚠️
    </span>
    <div v-if="isLogged">
      <p>Username: {{ profile.username }}</p>
      <p>Role: {{ profile.role }}</p>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useQuizzStore } from '@/stores/quizzStore';
import { useRoomStore } from '@/stores/roomStore';
import { storeToRefs } from 'pinia';
import { socket, connect } from '@/socket.js';
import JoinRoom from '@/components/JoinRoom.vue';

const authStore = useAuthStore();
const quizzStore = useQuizzStore();
const roomStore = useRoomStore();

quizzStore.getAllQuizzes();

const { isLogged, isAdmin, profile } = storeToRefs(authStore);
const { quizzes, isQuizzesLoading } = storeToRefs(quizzStore);

const leaveRoom = async () => {
  await connect();
  await roomStore.leaveRoom();
  await authStore.getProfile();
  socket.disconnect();
};
</script>
