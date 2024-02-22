<template>
  <main>
    <h2>ROOM view</h2>
    <p>Current room : {{ roomStore.roomName }} - {{ roomStore.roomId }}</p>
    <ConnectionState />
  </main>
</template>

<script>
import ConnectionState from '@/components/ConnectionState.vue';
import { useRoomStore } from '@/store/room.js';

export default {
  name: 'RoomView',
  components:{
    ConnectionState,
  },
  setup() {
    const roomStore = useRoomStore();

    return {
      roomStore,
    };
  },
};
</script>
