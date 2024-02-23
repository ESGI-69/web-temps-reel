<template>
  <p>All quizzes</p>
  <p v-if="isQuizzesLoading">
    Loading...
  </p>
  <ul>
    <li
      v-for="quizz in quizzes"
      :key="quizz.id"
    >
      {{ quizz.title }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';

const quizzStore = useQuizzStore();

const quizzes = computed(() => quizzStore.quizzes);
const isQuizzesLoading = computed(() => quizzStore.isQuizzesLoading);
</script>
