import { DataTypes, Model } from 'sequelize';
import { Quizz } from '../index.js';
/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Question extends Model {
    static associate() {
      this.belongsTo(Quizz, { foreignKey: 'quizzId' });
    }
  }

  Question.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      answer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
          min: 0,
        },
      },
      quizzId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'questions',
    },
  );
  return Question;
};
