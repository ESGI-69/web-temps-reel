<template>
  <main>
    <h2>ROOM view</h2>
    <template v-if="isRoomLoading">
      <p>Loading room...</p>
    </template>
    <template v-else>
      <p>Current room: {{ room.name }} (id: {{ room.id }})</p>
      <p>Question duration: {{ room.turnDuration }}s</p>
      <ToasterNotif />
      <p>Quizz Global duration : {{ timer }} s</p>

      <ConnectionState />

      <!-- <p>Quizz: {{ roomStore.room.title }}</p> -->
      <div
        v-if="profile.id === roomCreatorId"
      >
        <h3>Settings</h3>
        <p>Time to answer a question (in seconds): </p>
        <input
          v-model="questionsDuration"
          type="number"
          @change="onQuestionDurationChange"
        >
      </div>

      <h3>Rules : </h3>
      <p>Time to answer the questions : {{ questionsDuration }} </p>

      <p>Users in the room:</p>
      <ul v-if="room.players">
        <li
          v-for="user in room.players"
          :key="user"
        >
          {{ user.username }}
        </li>
      </ul>
      <ChatWindow />
      <button
        v-if="!room.startedAt && room.creator?.id === profile.id"
        @click="startGame"
      >
        Start game
      </button>
      <span v-if="!room.startedAt && room.creator?.id !== profile.id">
        Waiting for the owner to start the game...
      </span>
    </template>
    <button
      v-if="profile.id !== room.creator?.id && !room.startedAt"
      @click="leaveRoom()"
    >
      Leave room
    </button>
    <template v-if="room.startedAt">
      <p>Game started at: {{ room.startedAt }}</p>
      <p>Question number: {{ room.turnCount + 1 }}</p>
      <p>Question: {{ room.quizz.questions[room.turnCount].title }}</p>
      <p>Answers:</p>
      <ul>
        <li
          v-for="answer in room.quizz.questions[room.turnCount].options"
          :key="answer"
        >
          {{ answer }}
        </li>
      </ul>
    </template>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/stores/roomStore.js';
import { useAuthStore } from '@/stores/authStore';
import { socket, connect } from '@/socket.js';
import ChatWindow from '@/components/ChatWindow.vue';
import ToasterNotif from '@/components/ToasterNotif.vue';
import { useToasterStore } from '@/stores/toasterStore.js';
import { onMounted, ref, onUnmounted } from 'vue';
import { connect, socket } from '@/socket.js';

const toasterStore = useToasterStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { room, isRoomLoading } = storeToRefs(roomStore);
const { profile } = storeToRefs(authStore);

const timer = ref(0);
const questionsDuration = ref(0);
const roomCreatorId = ref('');

const startGame = async () => {
  await roomStore.startGame(room.value.id);
};

onMounted(async () => {
  await connect();
  await roomStore.getRoom(route.params.id);
  questionsDuration.value = room.value.questionsDuration;
  if (!room.value.players.map((player) => player.id).includes(profile.value.id)) {
    router.push({ name: 'home' });
  }
  toasterStore.addToast('Connected to the room', 'default');
  socket.on('timer', (newTimer) => {
    timer.value = newTimer;
  });
  roomCreatorId.value = room.value.creator.id;
});

const onQuestionDurationChange = async () => {
  await roomStore.updateRoom({
    id: room.value.id,
    questionsDuration: questionsDuration.value,
  });
};

onUnmounted(() => {
  socket.off('timer');
});

const leaveRoom = async () => {
  await roomStore.leaveRoom();
  socket.disconnect();
  router.push({ name: 'home' });
};

socket.on('roomUpdated', (roomUpdated) => {
  if (room.value.players && room.value.players.length < roomUpdated.players.length) {
    let newUser = roomUpdated.players[roomUpdated.players.length - 1];
    if (newUser.id !== profile.value.id) {
      toasterStore.addToast(`${newUser.username} joined the room`, 'default');
    }
  } else if (room.value.players && room.value.players.length > roomUpdated.players.length) {
    let leftUser = room.value.players.find(player => !roomUpdated.players.some(updatedPlayer => updatedPlayer.id === player.id));
    if (leftUser && leftUser.id !== profile.value.id) {
      toasterStore.addToast(`${leftUser.username} left the room`, 'default');
    }
  }
  roomStore.updateRoomState(roomUpdated);
});
</script>
