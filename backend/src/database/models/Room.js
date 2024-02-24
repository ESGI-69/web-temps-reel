import { DataTypes, Model } from 'sequelize';

import { Quizz, User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Room extends Model {
    static associate() {
      this.belongsTo(Quizz, { foreignKey: 'quizzId' });
      this.belongsTo(User, { foreignKey: 'createdBy' });
      this.hasMany(User);
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
    },
    {
      sequelize: connection,
      tableName: 'rooms',
    },
  );
  return Room;
};
