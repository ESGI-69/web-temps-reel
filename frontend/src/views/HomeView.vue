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
      v-if="isLogged && !isQuizzesLoading && quizzes.length > 0"
      to="/room"
    >
      Create a room
    </RouterLink>
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
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const quizzStore = useQuizzStore();

quizzStore.getAllQuizzes();

const { isLogged, isAdmin, profile } = storeToRefs(authStore);
const { quizzes, isQuizzesLoading } = storeToRefs(quizzStore);
</script>
