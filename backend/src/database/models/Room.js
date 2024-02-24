import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Room extends Model {
    static associate({ Quizz }) {
      this.belongsTo(Quizz, { foreignKey: 'quizzId' });
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
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      quizzId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'rooms',
    },
  );
  return Room;
};
