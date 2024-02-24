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
      v-if="isLogged"
      to="/room"
    >
      Create a room
    </RouterLink>
    <div v-if="isLogged">
      <p>Username: {{ profile.username }}</p>
      <p>Role: {{ profile.role }}</p>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { isLogged, isAdmin, profile } = storeToRefs(authStore);
</script>
