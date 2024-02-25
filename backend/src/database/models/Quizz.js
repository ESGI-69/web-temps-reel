import { DataTypes, Model } from 'sequelize';
import { Question } from '../index.js';
/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Quizz extends Model {
    static associate() {
      this.hasMany(Question, { as: 'questions', foreignKey: 'quizzId' });
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
