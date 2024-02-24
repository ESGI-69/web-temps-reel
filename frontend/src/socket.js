import { reactive } from 'vue';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

export const state = reactive({
  connected: false,
});

const URL = import.meta.env.VITE_SOCKET;

export const socket = io(URL, {
  autoConnect: false,
  query: {
    token: Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME),
  },
});

export const connect = () => new Promise((resolve) => {
  socket.connect();
  if (state.connected) {
    resolve();
  } else {
    socket.on('connect', () => {
      resolve();
    });
  }
});

socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});
