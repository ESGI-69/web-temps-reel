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
    await queryInterface.addColumn('rooms', 'startedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'turnDuration', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('rooms', 'turnCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('rooms', 'turnStartedAt', {
      type: Sequelize.DATE,
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
    await queryInterface.removeColumn('rooms', 'startedAt');
    await queryInterface.removeColumn('rooms', 'turnDuration');
    await queryInterface.removeColumn('rooms', 'turnCount');
    await queryInterface.removeColumn('rooms', 'turnStartedAt');
  },
};
