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
      {{ quizz.id }} -
      {{ quizz.title }}
      <RouterLink
        :to="`/admin/quizzes/${quizz.id}`"
      >
        Edit
      </RouterLink>
      <button
        @click="openModal(quizz.id)"
      >
        Delete
      </button>
      <Modal
        :is-open="isModalOpen === quizz.id"
        @update:is-open="isModalOpen = $event ? quizz.id : ''"
      >
        <div class="delete-quizz">
          Do you really want to delete this quizz : {{ quizz.title }} ?
          <button

            @click="onDelete(quizz.id)"
          >
            Yes
          </button>
          <button
            @click="isModalOpen = ''"
          >
            Cancel
          </button>
          <p v-if="isDeleteQuizzLoading">
            Loading...
          </p>
        </div>
      </Modal>
    </li>
  </ul>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';
import Modal from '@/components/Modal.vue';

const quizzStore = useQuizzStore();

const quizzes = computed(() => [ ...quizzStore.quizzes ].sort((a, b) => a.id - b.id));
const isQuizzesLoading = computed(() => quizzStore.isQuizzesLoading);
const isDeleteQuizzLoading = computed(() => quizzStore.isDeleteQuizzLoading);

const isModalOpen = ref('');

const openModal = (id) => {
  isModalOpen.value = id;
};

const onDelete = async (id) => {
  await quizzStore.deleteQuizz(id);
  isModalOpen.value = '';
};
</script>

<style scoped>
.delete-quizz {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
