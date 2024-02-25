'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('rooms', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'usersLimit', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('rooms', 'password');
    await queryInterface.removeColumn('rooms', 'usersLimit');
  },
};
