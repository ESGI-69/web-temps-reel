<template>
  <main>
    <h2>ROOM creator</h2>
    <p>Current room : {{ roomStore.roomName }} - {{ roomStore.roomId }}</p>
    <form @submit.prevent="onSubmit">
      <label for="name">Room name</label>
      <input
        id="name"
        v-model="room.name"
      >

      <p v-if="isQuizzesLoading">
        Quizzes list loading...
      </p>

      <label for="quizzId">Quizz</label>
      <select
        id="quizzId"
        v-model="room.quizzId"
      >
        <option
          v-for="quizz in quizzes"
          :key="quizz.id"
          :value="quizz.id"
        >
          {{ quizz.title }}
        </option>
      </select>

      <label from="turnDuration">Question duration in seconds</label>
      <input
        id="turnDuration"
        v-model="room.turnDuration"
        type="number"
      >

      <button
        type="submit"
        :disabled="roomStore.isPostRoomLoading"
      >
        Submit
      </button>
    </form>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, reactive } from 'vue';
import { useQuizzStore } from '@/stores/quizzStore';
import { useRoomStore } from '@/stores/roomStore';

const router = useRouter();
const quizzStore = useQuizzStore();
const roomStore = useRoomStore();

quizzStore.getAllQuizzes();

const quizzes = computed(() => [ ...quizzStore.quizzes ].sort((a, b) => a.id - b.id));
const isQuizzesLoading = computed(() => quizzStore.isQuizzesLoading);

const room = reactive({
  name: '',
  quizzId: '',
  turnDuration: 30,
});

const onSubmit = async () => {
  try {
    await roomStore.createRoom(room);
    router.push(`/room/${roomStore.room.id}`);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
