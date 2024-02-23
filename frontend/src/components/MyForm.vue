<template>
  <form @submit.prevent="onSubmit">
    <input v-model="value">

    <button
      type="submit"
      :disabled="isLoading"
    >
      Submit
    </button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const isLoading = ref(false);
const value = ref('');

//bugfix pour l'emit 'ambuiguity'
const emits = defineEmits('submit');
const onSubmit = () => {
  isLoading.value = true;
  emits('submit', value.value);
  isLoading.value = false;
};
</script>
