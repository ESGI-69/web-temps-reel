<template>
  <div class="about">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="username"
          required
        >
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        >
      </div>
      <button type="submit">
        Login
      </button>
    </form>
    <RouterLink to="/register">
      Create an account
    </RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const router = useRouter();

const login = async () => {
  try {
    await authStore.login({ username: username.value, password: password.value });
    router.push({ name: 'home' });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
</style>
