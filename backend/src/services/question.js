import { Question } from '../database/index.js';

export default {

  /**
   * Find all question matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return Question.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },

  findById: function (id) {
    return Question.findByPk(id);
  },

  create: async function (data) {
    const question = await Question.create(data);
    return this.findById(question.id);
  },

  update: async function (criteria, data) {
    const [, question = []] = await Question.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });
    if (!question.length) throw new Error('Question not found', { cause: 'Not Found' });
    return this.findById(question[0].id,
    );
  },

  remove: function (criteria) {
    return Question.destroy({
      where: criteria,
    });
  },
};
