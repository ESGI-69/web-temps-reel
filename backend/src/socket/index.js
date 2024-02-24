import { io } from '../index.js';
import Quizz from '../services/quizz.js';

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

    client.on('joinRoom', async (room) => {
      // users[id] = client;
      let roomId;
      if (rooms[room.name]) {
        roomId = rooms[room.name];
      } else {
        roomId = Math.floor(Math.random() * 100);
        rooms[room.name] = roomId;
      }
      client.join(roomId);
      const quizz = await Quizz.findById(room.quizzId);
      let roomCreated = {
        id:roomId,
        createdBy:room.createdBy,
        name:room.name,
        quizz:quizz,
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
