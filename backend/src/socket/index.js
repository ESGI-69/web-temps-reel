import { io } from '../index.js';
import userService from '../services/user.js';
import roomService from '../services/room.js';
import jwt from 'jsonwebtoken';

/**
 * @type {Object.<string, import('socket.io').Socket>}
 */
export let users = {};

/**
 * Assign the user socket to the game room
 * @param {import('../models').User} user
 * @param {string} [roomId] If not provided, the current game of the user will be used
 */
export const asignUserSocketToGameRoom = async (user, roomId) => {
  if (!user || !roomId) return; // If the user is not in a game, do nothing
  const socket = users[user.id];
  if (!socket) return; // If the user is not connected, do nothing
  await socket.join(roomId);
  // eslint-disable-next-line no-console
  console.log(`[Socket ${user.username}] Connected to room ${roomId}`);
  updateRoom(roomId);
};

/**
 * Remove the user socket from the game room
 * @param {import('../models').User} user
 * @param {string} [roomId] If not provided, the current game of the user will be used
 */
export const removeUserSocketFromGameRoom = async (user, roomId) => {
  if (!user || !roomId) return; // If the user is not in a game, do nothing
  const socket = users[user.id];
  if (!socket) return; // If the user is not connected, do nothing
  await socket.leave(roomId);
  // eslint-disable-next-line no-console
  console.log(`[Socket ${user.username}] Disconnected from room ${roomId}`);
  updateRoom(roomId);
};

export const updateRoom = async (roomId) => {
  const room = await roomService.findById(roomId);
  io.to(room.id).emit('roomUpdated', room);
};

export default () => {
  io.on('connection', async (client) => {

    let user;
    const clientJwt = client.handshake.query.token;

    jwt.verify(clientJwt, process.env.JWT_SECRET);
    const { id } = jwt.decode(clientJwt);
    user = await userService.findById(id);
    if (!user) {
      client.disconnect();
      // eslint-disable-next-line no-console
      console.log('[Socket] Unauthorized user');
      return;
    }
    users[id] = client;
    // eslint-disable-next-line no-console
    console.log(`[Socket ${user.username}] Connected`);
    asignUserSocketToGameRoom(user, user.currentRoom?.id);

    client.on('disconnect', () => {
      removeUserSocketFromGameRoom(user, user.currentRoom?.id);
      // eslint-disable-next-line no-console
      console.log('[Socket] disconnected');
      delete users[client.id];
    });
  });
};

export const sendMessageToRoom = async (room, message) => {
  if (!room || !message) return; // if the user is not in a game, do nothing
  //emit to the room the message
  await io.to(room).emit('messageRoom', message);
};
