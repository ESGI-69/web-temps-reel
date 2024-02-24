<template>
  <button @click="isModalOpen = true">
    Create a quizz
  </button>
  <Modal
    :is-open="isModalOpen"
    @update:is-open="isModalOpen = $event"
  >
    <h3>Create a quizz</h3>
    <form
      @submit.prevent="onSubmit"
    >
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        type="text"
      >
      <label for="description">Description</label>
      <input
        id="description"
        v-model="description"
        type="text"
      >
      <button
        type="submit"
        :disabled="isPostQuizzLoading"
      >
        Create
      </button>
    </form>
    <p v-if="isPostQuizzLoading">
      Loading...
    </p>
    <p v-if="!isFormValid">
      {{ errorMessage }}
    </p>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import { ref, computed } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';

const quizzStore = useQuizzStore();

const title = ref('');
const description = ref('');
const isModalOpen = ref(false);
const isFormValid = ref(true);
const errorMessage = ref('Both title and description are required');

const isPostQuizzLoading = computed(() => quizzStore.isPostQuizzLoading);

const onSubmit = async () => {
  if (!title.value || !description.value) {
    isFormValid.value = false;
    return;
  }
  isFormValid.value = true;
  await quizzStore.postQuizz({
    title: title.value,
    description: description.value,
  });
  title.value = '';
  description.value = '';
  isModalOpen.value = false;
};
</script>
