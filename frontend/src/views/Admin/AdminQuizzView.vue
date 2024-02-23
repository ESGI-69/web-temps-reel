<template>
  <h2>Edit the quizz</h2>
  <p v-if="isQuizzLoadging">
    Loading...
  </p>
  <form
    v-if="quizz"
    @submit.prevent="onQuizzPatch({ title, description })"
  >
    <div>
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
      >
    </div>
    <div>
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
      />
    </div>
    <p v-if="isPatchQuizzLoading">
      Loading...
    </p>
    <p v-if="isSuccessful">
      {{ successMessage }}
    </p>
    <p v-if="!isFormValid">
      {{ errorMessage }}
    </p>
    <button
      type="submit"
      :disabled="isPatchQuizzLoading"
    >
      Edit quizz
    </button>
    <RouterLink
      to="/admin/quizzes/"
    >
      Back
    </RouterLink>
  </form>
  <AdminQuestions
    :quizz-id="quizzId"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';
import { useRoute } from 'vue-router';
import AdminQuestions from '@/components/Admin/AdminQuestions.vue';

const quizzStore = useQuizzStore();

const route = useRoute();
const quizzId = route.params.id;

const isQuizzLoadging = computed(() => quizzStore.isQuizzLoading);
const isPatchQuizzLoading = computed(() => quizzStore.isPatchQuizzLoading);
const quizz = computed(() => quizzStore.quizz);

const title = ref('');
const description = ref('');
const isSuccessful = ref(false);
const successMessage = ref('Your quizz has been updated');
const isFormValid = ref(true);
const errorMessage = ref('Both title and description are required');

quizzStore.getQuizz(quizzId);

watch(quizz, (newQuizz) => {
  if (newQuizz) {
    title.value = newQuizz.title;
    description.value = newQuizz.description;
  }
}, { immediate: true });

const onQuizzPatch = async ({ title, description }) => {
  if (!title || !description) {
    isFormValid.value = false;
    return;
  }
  isFormValid.value = true;
  isSuccessful.value = false;
  await quizzStore.patchQuizz({ id: quizzId, title, description });
  isSuccessful.value = true;
};
</script>
