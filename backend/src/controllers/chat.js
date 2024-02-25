import userService from '../services/user.js';
// import chatService from '../services/chat.js';
import { sendMessageToRoom } from '../socket/index.js';

export default {
  /**
   * Express.js controller for POST /room
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  post: async (req, res, next) => {

    try {
      const user = await userService.findById(req.user.id);
      if (!user) return res.sendStatus(404);
      if (!user.currentRoom) return res.sendStatus(404);
      const chatPayload = {
        userId: user.id,
        userUsername: user.username,
        roomId: user.currentRoom.id,
        message: req.body.text,
      };
      sendMessageToRoom(user.currentRoom.id, chatPayload);
      res.status(201).json('ok');
    } catch (err) {
      next(err);
    }
  },

};
