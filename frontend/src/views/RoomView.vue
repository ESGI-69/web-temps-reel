<template>
  <ChatWindow />
  <main :class="{ shake: isShaking }">
    <h2>ROOM view</h2>
    <template v-if="isRoomLoading">
      <p>Loading room...</p>
    </template>
    <template v-else>
      <p>Current room: {{ room.name }} (id: {{ room.id }})</p>
      <ToasterNotif />
      <p>Quizz Global duration : {{ timer }} s</p>

      <ConnectionState />

      <!-- <p>Quizz: {{ roomStore.room.title }}</p> -->
      <div
        v-if="profile.id === roomCreatorId"
      >
        <h3>Settings</h3>
        <p>Change time to answer a question (in seconds): </p>
        <input
          v-model="turnDuration"
          type="number"
          @change="onQuestionDurationChange"
        >
      </div>
      <div>
        <h3>Rules : </h3>
        <p>Question duration: {{ room.turnDuration }}s</p>
      </div>

      <p>Users in the room:</p>
      <ul v-if="room.players">
        <li
          v-for="user in room.players"
          :key="user"
        >
          {{ user.username }}
        </li>
      </ul>
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
      <p class="bold">
        Question: {{ currentQuestion.title }}
      </p>
      <div class="answers">
        <div
          v-for="(answer, index) in currentQuestion.options"
          :key="answer"
          class="answer"
          :class="{
            disabled: myAnswerIndex !== null,
            selected: myAnswerIndex === index
          }"
          @click="onAnswerClick(index)"
        >
          {{ answer }}
        </div>
      </div>
      <p>Answers allready recived: {{ currentQuestionAnswers.length }}/{{ room.players.length }}</p>
      <p
        v-if="room.turnCount + 1 !== room.quizz.questions.length"
      >
        Time left to answer: {{ timeLeft }}s
      </p>
      <p
        v-else
      >
        Quizz done !!
      </p>
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
import { onMounted, ref, onUnmounted, computed, watch } from 'vue';

const toasterStore = useToasterStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { room, isRoomLoading } = storeToRefs(roomStore);
const { profile } = storeToRefs(authStore);

const timer = ref(0);
const turnDuration = ref(0);
const roomCreatorId = ref('');
const timeLeft = ref(0);
const intervalId = ref(null);

const isShaking = ref(false);

const startGame = async () => {
  await roomStore.startGame(room.value.id);
};

const currentQuestion = computed(() => room.value.quizz.questions[room.value.turnCount]);

const currentQuestionAnswers = computed(() => room.value.questionsAnswers.filter((questionAnswer) => questionAnswer.questionId === currentQuestion.value.id));

const myAnswerIndex = computed(() => {
  const answer = currentQuestionAnswers.value.find((questionAnswer) => questionAnswer.userId === profile.value.id);
  return answer?.answerIndex ?? null;
});

onMounted(async () => {
  await connect();
  await roomStore.getRoom(route.params.id);
  turnDuration.value = room.value.turnDuration;
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
    turnDuration: turnDuration.value,
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
  //notif démarrage de la partie
  if (room.value.turnStartedAt === null && roomUpdated.turnStartedAt !== null) {
    toasterStore.addToast('The game has started!', 'default');
  }
  //notif joueur rejoint la partie / joueur quitte la partie
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

socket.on('timeRunningOut', () => {
  toasterStore.addToast('Time is running out!', 'warning');
});

socket.on('wizz', () => {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 2000);
});

const onAnswerClick = async (answerIndex) => {
  await roomStore.answerCurrentQuestion(room.value.id, answerIndex);
};

socket.on('answerResult', (isCorrect, score) => {
  if (isCorrect) {
    toasterStore.addToast(`Correct answer, you won  ${score} points`, 'success');
  } else {
    toasterStore.addToast('Wrong answer', 'error');
  }
});

socket.on('countdown', (newCountdown) => {
  timeLeft.value = newCountdown;
});

const calculateTimeLeft = () => {
  const now = Date.now();
  const turnStartedAt = new Date(room.value.turnStartedAt).getTime();
  const turnEndsAt = turnStartedAt + room.value.turnDuration * 1000;
  timeLeft.value = Math.max(Math.floor((turnEndsAt - now) / 1000), 0);
  if (timeLeft.value === 0) {
    clearInterval(intervalId.value);
  }
};
const startCountdown = () => {
  if (intervalId.value) {
    clearInterval(intervalId);
  }
  intervalId.value = setInterval(calculateTimeLeft, 1000);
};

watch(() => room.value.turnStartedAt, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== null) {
    startCountdown();
  }
});
</script>

<style>
.bold {
  font-weight: bold;
}

.answers {
  display: flex;
  gap: 10px;
}

.answer {
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  flex-grow: 1;
  display: flex;
  text-align: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;

  &:nth-child(1) {
    background-color: #f1c40f;
  }

  &:nth-child(2) {
    background-color: #e74c3c;
  }

  &:nth-child(3) {
    background-color: #3498db;
  }

  &:hover {
    box-shadow: 0 0 0 2px red;
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.selected {
  box-shadow: 0 0 0 2px green;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
.shake {
  animation: shake 0.1s;
  animation-iteration-count: 100;
}
</style>
