import { DataTypes, Model } from 'sequelize';

import { Quizz, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Room extends Model {
    static associate() {
      this.belongsTo(Quizz, { foreignKey: 'quizzId', as: 'quizz' });
      this.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
      this.hasMany(User, { as: 'players' });
    }
  }

  Room.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      turnDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      turnCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      turnStartedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'rooms',
    },
  );
  return Room;
};
