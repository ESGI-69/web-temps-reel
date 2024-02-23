<template>
  <div class="about">
    <h1>Register</h1>
    <form @submit.prevent="register">
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
        Register
      </button>
    </form>
    <RouterLink to="/login">
      Already have an account?
    </RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const username = ref('');
const password = ref('');

const router = useRouter();

const register = async () => {
  try {
    await userStore.postUser({ username: username.value, password: password.value });
    router.push({ name: 'login' });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
</style>
