import roomService from '../services/room.js';
import userService from '../services/user.js';
import { roomCountdowns, roomTimers, sendIsCorrect, updateRoom } from '../socket/index.js';
import bcrypt from 'bcryptjs';
import roomUserQuestionsAnswersService from '../services/roomUserQuestionsAnswers.js';

export const calculateScore = (timeStarted, timeAnswered, duration) => {
  //duration provient de room.turnDuration
  const timeTaken = (timeAnswered - timeStarted ) / 1000;
  if (timeTaken > duration) return 0;
  const remainingTimePercentage = ((duration - timeTaken) / duration) * 100;
  const score = (remainingTimePercentage / 100) * 100;
  return Math.round(score);
};

export default {
  /**
   * Express.js controller for GET /room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  cget: async (req, res, next) => {
    const {
      _sort = {},
      ...criteria
    } = req.query;
    try {
      const room = await roomService.findAll(criteria, {
        order: _sort,
      });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /room/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  get: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      if (!room) return res.sendStatus(404);
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields
      const roomPayload = {
        name: req.body.name,
        quizzId: req.body.quizzId,
        turnDuration: req.body.turnDuration,
        createdBy: req.user.id,
        password: req.body.password,
        usersLimit: req.body.usersLimit,
      };
      const room = await roomService.create(roomPayload);
      await userService.update({ id: req.user.id }, { RoomId: room.id });

      roomTimers.start(room.id);
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for PATCH /room/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patch: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      if (!room) return res.sendStatus(404);
      if (room.createdBy !== req.user.id) {
        return res.sendStatus(403);
      }
      const roomUpdated = await roomService.update({ id: req.params.id }, req.body);
      updateRoom(req.params.id);
      res.json(roomUpdated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for DELETE /room/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      const room = await roomService.remove({ id: req.params.id });
      if (!room) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for PATCH /room/:id/join
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  join: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      const password = req.body.password;
      if (!room) return res.sendStatus(404);
      if (room.password && !(await bcrypt.compare(password, room.password))) return res.status(403).send('Invalid password');
      if (room.usersLimit && room.players.length >= room.usersLimit ) return res.status(403).send('Room is full');
      await userService.update({ id: req.user.id }, { RoomId: room.id });
      res.json(room);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /room/leave
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  leave: async (req, res, next) => {
    try {
      await userService.update({ id: req.user.id }, { RoomId: null });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for PATCH /room/:id/start
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  start: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      if (!room) return res.sendStatus(404);
      if (room.createdBy !== req.user.id) return res.sendStatus(403);
      await roomService.update({ id: req.params.id }, { startedAt: new Date(), turnStartedAt: new Date() });
      updateRoom(req.params.id);
      console.log('RoomId', room.id);
      console.log('room.turnDuration', room.turnDuration);
      roomCountdowns.start(room.id, room.turnDuration);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  answer: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      if (!room) return res.sendStatus(404);
      const user = await userService.findById(req.user.id);
      if (!user) return res.sendStatus(404);
      if (user.RoomId !== room.id) return res.status(403).send('Not in the room');
      if (req.body.answerIndex === undefined) return res.status(400).send('answerIndex is required');
      const currentQuestion = room.quizz.questions[room.turnCount];
      const timeAnswered = Date.now();

      const isCorrect = req.body.answerIndex === currentQuestion.answer;

      let score = 0;
      if ( isCorrect ) {
        score = calculateScore(room.turnStartedAt, timeAnswered, room.turnDuration);
      }

      await roomUserQuestionsAnswersService.create({
        roomId: room.id,
        userId: user.id,
        questionId: currentQuestion.id,
        answerIndex: req.body.answerIndex,
        score: score,
      });
      updateRoom(req.params.id);
      sendIsCorrect(isCorrect, user.id, score);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
