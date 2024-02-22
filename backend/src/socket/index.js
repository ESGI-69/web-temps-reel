import { io } from '../index.js';

/**
 * @type {Object.<string, import('socket.io').Socket>}
 */
export let users = {};

export default () => {
  io.on('connection', (client) => {
    // const clientJwt = client.handshake.query.token;
    // eslint-disable-next-line no-console
    console.log('[Socket] connected');

    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('[Socket] disconnected');
      delete users[client.id];
    });

    client.on('joinRoom', (room) => {
      // users[id] = client;
      console.log(`User join room: ${room}`);
    });

    client.on('leaveRoom', (room) => {
      client.leave(room);
      console.log(`User left room: ${room}`);
    });

  });

  
};

export const joinSocketRoom = async (userId, roomId) => {
  const socket = users[userId];
  console.log(users);
  await socket.join(roomId);
  console.log(`User joined room: ${roomId}`);
};