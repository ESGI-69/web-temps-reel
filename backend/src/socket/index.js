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
      let roomId;
      if (rooms[room]) {
        roomId = rooms[room];
      } else {
        roomId = Math.floor(Math.random() * 100);
        rooms[room] = roomId;
      }
      client.join(roomId);
      let roomCreated = {
        id:roomId,
        name:room,
      };
      client.emit('roomJoined', roomCreated);
      // send roomUsers event to all clients in the room
      io.to(roomId).emit('roomUsers', getRoomUsers(roomId));
    });

    // create event that return the list of socket connected to the same room as the client
    client.on('getRoomUsers', (room) => {
      //get the list of clients connected to the room
      let roomId = rooms[room];
      client.emit('roomUsers', getRoomUsers(roomId));
    });

    client.on('leaveRoom', (room) => {
      let roomId = rooms[room];
      client.leave(room);
      io.to(roomId).emit('roomUsers', getRoomUsers(roomId));
    });

  });
};

const getRoomUsers = (room) => {
  let clients = io.sockets.adapter.rooms.get(room);
  let clientsArray = Array.from(clients);
  return clientsArray;
};

export const joinSocketRoom = async (userId, roomId) => {
  const socket = users[userId];
  await socket.join(roomId);
};
