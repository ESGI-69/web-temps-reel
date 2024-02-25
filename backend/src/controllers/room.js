import roomService from '../services/room.js';
import userService from '../services/user.js';
import { updateRoom } from '../socket/index.js';

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
      };
      const room = await roomService.create(roomPayload);
      await userService.update({ id: req.user.id }, { RoomId: room.id });

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
      const room = await roomService.update({ id: req.params.id }, req.body);
      if (!room) return res.sendStatus(404);
      res.json(room);
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
   * Express.js controller for GET /room/:id/join
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  join: async (req, res, next) => {
    try {
      const room = await roomService.findById(req.params.id);
      if (!room) return res.sendStatus(404);
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
      console.log('EMITTING ROOM STARTED TO', req.params.id);
      updateRoom(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
