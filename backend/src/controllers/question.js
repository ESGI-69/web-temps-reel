import questionService from '../services/question.js';

export default {
  /**
   * Express.js controller for GET /question
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
      const question = await questionService.findAll(criteria, {
        order: _sort,
      });
      res.json(question);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /question/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  get: async (req, res, next) => {
    try {
      const question = await questionService.findById(req.params.id);
      if (!question) return res.sendStatus(404);
      res.json(question);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for POST /question
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields
      const questionPayload = {
        title: req.body.title,
        options: req.body.options,
        answer: req.body.answer,
        quizzId: req.body.quizzId,
      };
      const question = await questionService.create(questionPayload);
      res.status(201).json(question);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for PATCH /question/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  patch: async (req, res, next) => {
    try {
      const question = await questionService.update({ id: req.params.id }, req.body);
      res.json(question);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for DELETE /question/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  delete: async (req, res, next) => {
    try {
      await questionService.remove({ id: req.params.id });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
