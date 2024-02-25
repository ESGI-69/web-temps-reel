import userService from '../services/user.js';
// import chatService from '../services/chat.js';
import quizzService from '../services/quizz.js';
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
      const quizzId = user.currentRoom.quizzId;
      const chatPayload = {
        userId: user.id,
        userUsername: user.username,
        roomId: user.currentRoom.id,
        message: req.body.text,
        quizzId: quizzId,
        messageType: 'default',
      };

      //find if the message content is the same as the answer of the current question of the quizz
      const quizz = await quizzService.findById(req.body.quizzId);
      // if (quizz.currentQuestion.answer === req.body.text) {
      //   //replace the message content with "Pas de triche !!"
      //   chatPayload.message = 'Pas de triche !!';
      //   chatPayload.messageType = 'warning';
      // }
      sendMessageToRoom(user.currentRoom.id, chatPayload);
      res.status(201).json('ok');
    } catch (err) {
      next(err);
    }
  },

};
