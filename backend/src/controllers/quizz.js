import quizzService from '../services/quizz.js';

export default {
  /**
   * Express.js controller for GET /quizz
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
      const quizz = await quizzService.findAll(criteria, {
        order: _sort,
      });
      res.json(quizz);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /quizz/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  get: async (req, res, next) => {
    try {
      const quizz = await quizzService.findById(req.params.id);
      if (!quizz) return res.sendStatus(404);
      res.json(quizz);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /quizz
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields
      const quizzPayload = {
        title: req.body.title,
        description: req.body.description,
      };
      const quizz = await quizzService.create(quizzPayload);
      res.status(201).json(quizz);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for PATCH /quizz/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patch: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields
      const quizzPayload = {
        title: req.body.title,
        description: req.body.description,
      };
      const quizz = await quizzService.update({ id: req.params.id }, quizzPayload);
      res.json(quizz);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for DELETE /quizz/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      await quizzService.remove({ id: req.params.id });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
