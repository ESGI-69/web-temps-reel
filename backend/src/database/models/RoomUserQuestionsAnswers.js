import { Question, Room, User } from '../index.js';
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class RoomUserQuestionsAnswers extends Model {
    static associate() {
      this.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
      this.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }

  RoomUserQuestionsAnswers.init(
    {
      answerIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'room_user_questions_answers',
    },
  );

  return RoomUserQuestionsAnswers;
};
