import userService from '../services/user.js';

export default {
  /**
   * Express.js controller for GET /users
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
      const users = await userService.findAll(criteria, {
        order: _sort,
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for POST /users
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {
    try {
      // Avoid injecting unwanted fields like role on user creation
      const userPayload = {
        username: req.body.username,
        password: req.body.password,
      };
      const user = await userService.create(userPayload);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller for GET /users/me
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  me: async (req, res, next) => {
    try {
      const user = await userService.findById(req.user.id);
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  /**
   * Express.js controller for GET /users/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  get: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.params.id));
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
