<template>
  <div class="chat-window">
    <div
      v-show="isEmojiDisplayed"
      id="emojiReaction"
    >
      ❤️
    </div>
    <div class="chat-messages">
      <div
        v-for="message in chatStore.chatMessages"
        :key="message.id"
      >
        <p :class="{'warning': message.messageType === 'warning'}">
          <strong>{{ message.userUsername }}:</strong> {{ message.message }}
        </p>
      </div>
    </div>
    <form @submit.prevent="send">
      <input
        v-model="newMessage"
        placeholder="Envoyer un message"
      >
      <button type="submit">
        Send
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useChatStore } from '@/stores/chatStore.js';
import { socket } from '@/socket.js';

const chatStore = useChatStore();
const newMessage = ref('');
const isEmojiDisplayed = ref(false);

const send = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage({ text: newMessage.value });
    newMessage.value = '';
  }
};

const popEmoji = () => {
  isEmojiDisplayed.value = true;
  setTimeout(() => {
    isEmojiDisplayed.value = false;
  }, 2000);
};
const emojiRoomHandler = (message) => {
  chatStore.addMessage(message);
  popEmoji();
};


onBeforeUnmount(() => {
  socket.off('messageRoom', messageRoomHandler);
  socket.off('love', emojiRoomHandler);
});

const messageRoomHandler = (message) => {
  chatStore.addMessage(message);
};

socket.on('messageRoom', messageRoomHandler);
socket.on('love', emojiRoomHandler);
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 50%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  position: absolute;
  bottom: 5%;
  right: 10%;
  width: 20%;
  z-index: 2;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.chat-messages p {
  margin: 0 0 10px 0;
  padding: 5px;
  border-radius: 5px;
  background-color: #e8e8e8;
  color: black;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.chat-messages .warning {
  color: red;
  background-color: #ffdada;
}

form {
  display: flex;
  margin-top: 10px;
}

input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

#emojiReaction{
  position: absolute;
  font-size: 90px;
  animation: float 2s forwards;
}
@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}
</style>
