import { joinSocketRoom } from '../socket/index.js';

export default {
    get: (req, res) => {
      res.send({
        message: 'List of rooms',
      });
    },

    getRoom: (req,res) => {
      const roomId = req.params.id;
      res.send(
        `Details of room ${roomId}`
      )
    },

    createRoom: (req, res) => {
      try {
        let roomId = Math.floor(Math.random() * 10);
        let userId = req.body.user.id;
        joinSocketRoom(userId,roomId);
        res.status(201).json({ id: roomId });
      } catch (error) {
        console.log(error);
      }
    }


  };
  