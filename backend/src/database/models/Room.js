import { DataTypes, Model } from 'sequelize';
import { Quizz, RoomUserQuestionsAnswers, User } from '../index.js';
import bcrypt from 'bcryptjs';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Room extends Model {
    static associate() {
      this.belongsTo(Quizz, { foreignKey: 'quizzId', as: 'quizz' });
      this.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
      this.hasMany(User, { as: 'players' });
      this.hasMany(RoomUserQuestionsAnswers, { as: 'questionsAnswers', foreignKey: 'roomId' });
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
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usersLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'rooms',
    },
  );

  /**
   * Encrypt the password before creating or updating the room
   * @param {Room} room Room model
   * @param {import('sequelize').UpdateOptions} [options] Update options
   */
  const encryptPassword = async (room, options) => {
    if (!options?.fields.includes('password') || room.password === null) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    room.password = await bcrypt.hash(room.password, salt);
  };

  Room.addHook('beforeCreate', encryptPassword);

  Room.addHook('beforeUpdate', encryptPassword);

  return Room;
};
