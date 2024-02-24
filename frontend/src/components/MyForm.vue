<template>
  <form @submit.prevent="onSubmit">
    <input v-model="value">

    <p v-if="isQuizzesLoading">
      Quizzes list loading...
    </p>

    <select
      v-model="selected"
    >
      <option
        v-for="quizz in quizzes"
        :key="quizz.id"
        :value="quizz.id"
      >
        {{ quizz.title }}
      </option>
    </select>

    <button
      type="submit"
      :disabled="isLoading"
    >
      Submit
    </button>
  </form>
</template>

<script setup>
import { computed, ref, defineEmits } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';

const quizzStore = useQuizzStore();

const quizzes = computed(() => [ ...quizzStore.quizzes ].sort((a, b) => a.id - b.id));
const isQuizzesLoading = computed(() => quizzStore.isQuizzesLoading);

const isLoading = ref(false);
const value = ref('');
const selected = ref('');

//bugfix pour l'emit 'ambuiguity'
const emits = defineEmits('submit');
const onSubmit = () => {
  isLoading.value = true;
  const submited_value = {
    name: value.value,
    quizzId: selected.value,
  };
  emits('submit', submited_value);
  // emits('submit', value.value);
  isLoading.value = false;
};
</script>
