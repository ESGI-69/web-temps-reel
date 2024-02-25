import { Question, Quizz, Room, User } from './../database/index.js';

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

};
