<template>
  <div>
    <h2>Questions</h2>
    <button
      @click="isModalOpen = true"
    >
      Add a question
    </button>
    <Modal
      :is-open="isModalOpen"
      @update:is-open="isModalOpen = $event"
    >
      <form
        @submit.prevent="onQuestionPost()"
      >
        <div>
          <label for="question">Question</label>
          <input
            id="question"
            v-model="questionTitle"
          >
        </div>
        <div
          v-for="(choice, index) in choices"
          :key="index"
        >
          <label :for="`choice-${index}`">Choice {{ index + 1 }}</label>
          <input
            :id="`choice-${index}`"
            v-model="choices[index]"
          >
        </div>

        <div>
          <label for="answer">Answer</label>
          <select
            id="answer"
            v-model="answer"
          >
            <option
              value=""
              disabled
              selected
            >
              Select the good answer
            </option>
            <option
              v-for="(choice, index) in choices"
              :key="index"
              :value="index"
            >
              {{ choice }}
            </option>
          </select>
        </div>
        <p v-if="!isFormValid">
          {{ errorMessage }}
        </p>
        <button
          type="submit"
          :disabled="isQuestionPostLoading"
        >
          Add question
        </button>
      </form>
    </Modal>
    <p v-if="isQuestionsByQuizzLoading">
      Loading...
    </p>

    <ul>
      <li
        v-for="question in questionsByQuizz"
        :key="question.id"
      >
        {{ question.id }} |
        {{ question.title }}
        | Réponses :
        <span
          v-for="(choice, index) in question.options"
          :key="index"
          :class="{ 'good-answer': question.answer === index }"
        >
          {{ choice }} -
        </span>
        <button
          @click="openDeleteModal(question.id)"
        >
          Delete
        </button>

        <Modal
          :is-open="isDeleteModalOpen === question.id"
          @update:is-open="isDeleteModalOpen = $event ? question.id : ''"
        >
          <div class="delete-quizz">
            Do you really want to delete this question : {{ question.title }} ?
            <button
              @click="onDelete(question.id)"
            >
              Yes
            </button>
            <button
              @click="isDeleteModalOpen = ''"
            >
              Cancel
            </button>
            <p v-if="isDeleteQuestionLoading">
              Loading...
            </p>
          </div>
        </Modal>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Modal from '@/components/Modal.vue';
import { useQuestionStore } from '@/stores/questionStore';

const props = defineProps({
  quizzId: {
    type: String,
    required: true,
  },
});

const questionStore = useQuestionStore();

const isQuestionPostLoading = computed(() => questionStore.isQuestionPostLoading);
const isQuestionsByQuizzLoading = computed(() => questionStore.isQuestionsByQuizzLoading);
const isDeleteQuestionLoading = computed(() => questionStore.isDeleteQuestionLoading);
const questionsByQuizz = computed(() => questionStore.questionsByQuizz);

questionStore.getQuestionsByQuizz(props.quizzId);

const isModalOpen = ref(false);
const isDeleteModalOpen = ref('');
const isFormValid = ref(true);
const errorMessage = ref('All fields are required');
const questionTitle = ref('');
const choices = ref([
  '',
  '',
  '',
]);
const answer = ref('');


const onQuestionPost = async () => {
  if (!questionTitle.value) {
    isFormValid.value = false;
    return;
  }

  if (answer.value === '' || answer.value === null || answer.value === undefined) {
    isFormValid.value = false;
    return;
  }

  if (choices.value.some((choice) => !choice)) {
    isFormValid.value = false;
    return;
  }

  isFormValid.value = true;

  await questionStore.postQuestion({
    title: questionTitle.value,
    options: choices.value,
    answer: answer.value,
    quizzId: props.quizzId,
  });

  questionTitle.value = '';
  choices.value = [
    '',
    '',
    '',
  ];
  answer.value = '';

  isModalOpen.value = false;
};

const openDeleteModal = (id) => {
  isDeleteModalOpen.value = id;
};

const onDelete = async (id) => {
  await questionStore.deleteQuestion(id);
  isDeleteModalOpen.value = '';
};
</script>

<style scoped>
.good-answer {
  color: green;
}

.delete-quizz {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
