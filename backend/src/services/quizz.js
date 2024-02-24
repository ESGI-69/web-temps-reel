import { Quizz } from './../database/index.js';

export default {

  /**
   * Find all quizz matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return Quizz.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },

  findById: function (id) {
    return Quizz.findByPk(id);
  },

  create: async function (data) {
    const quizz = await Quizz.create(data);
    return this.findById(quizz.id);
  },

  update: async function (criteria, data) {
    const [, quizz = []] = await Quizz.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });
    if (!quizz.length) throw new Error('Quizz not found', { cause: 'Not Found' });
    return this.findById(quizz[0].id,
    );
  },

  remove: function (criteria) {
    return Quizz.destroy({
      where: criteria,
    });
  },
};
