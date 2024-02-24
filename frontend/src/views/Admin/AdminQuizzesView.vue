<template>
  <h2>
    Admin quizzes view
  </h2>
  <AdminCreateQuizz />
  <AdminAllQuizzes />
</template>

<script setup>
import AdminCreateQuizz from '@/components/Admin/AdminCreateQuizz.vue';
import AdminAllQuizzes from '@/components/Admin/AdminAllQuizzes.vue';
import { useQuizzStore } from '@/stores/quizzStore';

const quizzStore = useQuizzStore();

quizzStore.getAllQuizzes();
</script>
