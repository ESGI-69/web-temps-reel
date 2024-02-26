import { RoomUserQuestionsAnswers } from './../database/index.js';

export default {
  create: function (data) {
    return RoomUserQuestionsAnswers.create(data);
  },
};
