import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Quizz extends Model {
    static associate() {
    }
  }

  Quizz.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'quizzs',
    },
  );
  return Quizz;
};
