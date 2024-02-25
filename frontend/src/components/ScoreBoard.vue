<template>
  <div class="score-board">
    <h2>Score Board</h2>
    <ul>
      <li
        v-for="player in sortedPlayers"
        :key="player.id"
      >
        {{ player.username }}: {{ player.score }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/roomStore.js';
import { computed } from 'vue';

const roomStore = useRoomStore();
const sortedPlayers = computed(() => {
  //Need ajouter dans le roomStore.room.players le .score !
  if (roomStore.room && roomStore.room.players) {
    return [ ...roomStore.room.players ].sort((a, b) => b.score - a.score);
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
  background-color: #f8f8f8;
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
