import roomService from '../services/room.js';
import userService from '../services/user.js';
// import { joinSocketRoom } from '../socket/index.js';

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
};
