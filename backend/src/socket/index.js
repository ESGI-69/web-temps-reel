import { io } from '../index.js';

/**
 * @type {Object.<string, import('socket.io').Socket>}
 */
export let users = {};
export let rooms = {};

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
      const roomId = Math.floor(Math.random() * 100);
      client.join(roomId);
      let roomCreated = {
        id:roomId,
        name:room,
      };
      client.emit('roomJoined', roomCreated);
      rooms[roomId] = room;
    });

    client.on('leaveRoom', (room) => {
      client.leave(room);
    });

  });
};

export const joinSocketRoom = async (userId, roomId) => {
  const socket = users[userId];
  await socket.join(roomId);
};
