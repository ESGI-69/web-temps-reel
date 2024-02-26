import { Question, Quizz, Room, RoomUserQuestionsAnswers, User } from './../database/index.js';
import { updateRoom } from '../socket/index.js';
import questionService from './question.js';

let roomTurnTimeouts = {};

export default {

  /**
  * Find all room matching the criteria
  * @param {import('sequelize').WhereOptions} criteria
  * @param {import('sequelize').FindOptions} options
  * @returns
  */
  findAll: function (criteria, options = {}) {
    return Room.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },

  findById: function (id) {
    return Room.findByPk(id, {
      include: [
        {
          as: 'quizz',
          model: Quizz,
          include: [
            {
              as: 'questions',
              model: Question,
            },
          ],
        },
        {
          as: 'creator',
          model: User,
        },
        {
          as: 'players',
          model: User,
        },
        {
          as: 'questionsAnswers',
          model: RoomUserQuestionsAnswers,
        },
      ],
    });
  },

  create: async function (data) {
    const room = await Room.create(
      data,
      {
        include: [
          {
            model: Quizz,
            as: 'quizz',
          },
          {
            model: User,
            as: 'creator',
          },
        ],
      });
    return this.findById(room.id);
  },

  update: async function (criteria, data) {
    const [, room = []] = await Room.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });
    if (!room.length) throw new Error('Room not found', { cause: 'Not Found' });
    return this.findById(room[0].id,
    );
  },

  remove: function (criteria) {
    return Room.destroy({
      where: criteria,
    });
  },

  startTimer: function (room) {
    if (roomTurnTimeouts[room.id]) {
      clearTimeout(roomTurnTimeouts[room.id]);
    }
    roomTurnTimeouts[room.id] = setTimeout(() => {
      this.changeTurnCount(room);
    }, room.turnDuration * 1000);
  },

  changeTurnCount: async function (room) {
    const questions = await questionService.findAll({ quizzId: room.quizzId });
    console.log('questions', questions);
    if (room.turnCount + 1 < questions.length) {
      const updatedRoom = await this.update({ id: room.id }, { turnCount: room.turnCount + 1, turnStartedAt: new Date() });
      console.log('updatedRoom', updatedRoom);
      updateRoom(updatedRoom.id);
      this.startTimer(updatedRoom);
    } else {
      this.update({ id: room.id }, { turnStartedAt: null });
      updateRoom(room.id);
    }
  },
};
