import jwt from 'jsonwebtoken';
import userService from './services/user.js';
import { users } from './socket/index.js';
import roomService from './services/room.js';

/**
 * User population middleware. This middleware will populate the user in the request object from the JWT token.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const populateUser = async (req, res, next) => {
  if (
    req.headers.authorization
    && req.headers.authorization?.split(' ').length === 2
    && req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userService.findById(id);
      if (!req.user) return res.sendStatus(401);
      next();
    } catch (err) {
      return res.sendStatus(401);
    }
  } else {
    next();
  }
};

/**
 * Check if the user is logged in. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isLogged = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  next();
};

/**
 * Check if the user is an Admin. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  if (req.user.mailToken) return res.status(401).send({
    code: 'email_not_validated',
    message: 'Email not validated',
  });
  if (!req.user.isAdmin()) return res.sendStatus(403);
  next();
};

const isUserInRoom = (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  if (!req.user.RoomId) return res.status(403).send({
    code: 'not_in_room',
    message: 'Not in room',
  });
  next();
};

const isUserRoomStarted = async (req, res, next) => {
  if (!req.user) return res.status(401).send({
    code: 'not_logged_in',
    message: 'Not logged in',
  });
  if (!req.user.RoomId) return res.status(403).send({
    code: 'not_in_room',
    message: 'Not in room',
  });
  const room = await roomService.findById(req.user.RoomId);
  if (!room.startedAt) return res.status(403).send({
    code: 'room_not_started',
    message: 'Room not started',
  });
  next();
};

/**
 * Check if the user is connected to a socket. If not, return 401.
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 */
const isConnectedToSocket = (req, res, next) => {
  try {
    if (!users[req.user.id]) throw new Error('User not connected to socket', { cause: 'Unauthorized', code: 'not_connected_to_socket' });
    req.socket = users[req.user.id];
    next();
  } catch (error) {
    next(error);
  }
};

export {
  isAdmin,
  isConnectedToSocket,
  isLogged,
  isUserInRoom,
  isUserRoomStarted,
  populateUser,
};
