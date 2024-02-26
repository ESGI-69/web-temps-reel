<template>
  <div class="score-board">
    <h2>Score Board</h2>
    <ul>
      <li
        v-for="player in sortedPlayers"
        :key="player.id"
      >
        {{ player.username }}: {{ player.totalScore }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/roomStore.js';
import { computed } from 'vue';

const roomStore = useRoomStore();
const sortedPlayers = computed(() => {
  if (roomStore.room && roomStore.room.players) {
    return roomStore.room.players.map(player => {
      const playerAnswers = roomStore.room.questionsAnswers.filter(answer => answer.userId === player.id);
      const totalScore = playerAnswers.reduce((sum, answer) => sum + answer.score, 0);
      return { ...player, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }
  return [];
});
</script>

<style scoped>
.score-board {
  position: fixed;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #777;
  color: #fff;
  border-left: 1px solid #ccc;
  overflow-y: auto;
}

.score-board h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  text-align: center;
}

.score-board ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.score-board li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.score-board li:last-child {
  border-bottom: none;
}
</style>
