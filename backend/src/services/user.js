import { Room, User } from './../database/index.js';

export default {
  /**
   * Find a user by email and return it with its password
   * @param {import('sequelize').WhereOptions} criteria
   * @returns
   */
  findLogin: function (criteria) {
    return User.scope('withPassword').findOne({
      where: criteria,
    });
  },
  /**
   * Find all users matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @param {import('sequelize').FindOptions} options
   * @returns
   */
  findAll: function (criteria, options = {}) {
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: function (id) {
    return User.findByPk(id, { include: Room });
  },
  findByIdWithPassword: function (id) {
    return User.scope('withPassword').findByPk(id);
  },
  create: async function (data) {
    const user = await User.create(data);
    return this.findById(user.id);
  },
  update: async function (criteria, data) {
    const [, users = []] = await User.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true, // to trigger the encryption hook on update (see user model)
    });
    if (!users.length) throw new Error('User not found', { cause: 'Not Found' });
    return this.findById(users[0].id) ;
  },
  validate: function (data) {
    return User.build(data).validate();
  },
  remove: function (criteria) {
    return User.destroy({
      where: criteria,
    });
  },
  addXp: function (userModel, amount) {
    return userModel.increment('xp', { by: amount });
  },
};
