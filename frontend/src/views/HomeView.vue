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
      v-if="isLogged"
      to="/room"
    >
      Create a room
    </RouterLink>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const { isLogged } = storeToRefs(authStore);
</script>
