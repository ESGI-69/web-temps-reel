
<template>
  <button
    @click="isModalOpen = true"
  >
    Join a room
  </button>
  <Modal
    :is-open="isModalOpen"
    @update:is-open="isModalOpen = $event"
  >
    <h3>Join a room</h3>
    <form
      @submit.prevent="onSubmit"
    >
      <label for="roomCode">Room code</label>
      <input
        id="roomCode"
        v-model="roomCode"
        type="text"
      >
      <label for="roomPassword">Room password</label>
      <input
        id="roomPassword"
        v-model="roomPassword"
        type="password"
      >
      <button
        type="submit"
        :disabled="isRoomLoading"
      >
        Join
      </button>
    </form>
    <p v-if="isRoomLoading">
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
import { useRoomStore } from '@/stores/roomStore';
import { useRouter } from 'vue-router';

const roomStore = useRoomStore();
const router = useRouter();

const roomCode = ref('');
const roomPassword = ref('');
const isModalOpen = ref(false);
const isFormValid = ref(true);
const errorMessage = ref('Room code is required');

const isRoomLoading = computed(() => roomStore.isRoomLoading);

const onSubmit = async () => {
  if (!roomCode.value) {
    isFormValid.value = false;
    return;
  }

  try {
    await roomStore.joinRoom(roomCode.value, roomPassword.value);
    isModalOpen.value = false;
    roomCode.value = '';
    isFormValid.value = true;
    router.push(`/room/${roomStore.room.id}`);
  } catch (error) {
    if ( error.response.status === 404) {
      errorMessage.value = 'No room found with this code';
      isFormValid.value = false;
    } else if (error.response.status === 403) {
      errorMessage.value = 'The room is full or the password is invalid';
      isFormValid.value = false;
    }
  }
};
</script>
