import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

import user from './models/user.js';
import quizz from './models/Quizz.js';
import question from './models/Question.js';
import room from './models/Room.js';

dotenv.config();

const mongoDomainName = process.env.MONGO_DATABASE_SERVICE_SERVICE_HOST || 'localhost';
const postgresDomainName = process.env.POSGRES_DATABASE_SERVICE_SERVICE_HOST || 'localhost';

// eslint-disable-next-line no-console
console.log(`Connecting to postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`);
const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`, { logging: false });

let mongo;

const connectMongo = async () => {
  // eslint-disable-next-line no-console
  console.log(`Connecting to mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${mongoDomainName}:27017/${process.env.MONGO_INITDB_DATABASE}`);
  mongo = await mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${mongoDomainName}:27017/${process.env.MONGO_INITDB_DATABASE}`, {
    authSource: 'admin',
  });
};

// Load models
const User = user(sequelize);
const Quizz = quizz(sequelize);
const Question = question(sequelize);
const Room = room(sequelize);

// Launch associations methods for relations between tables
User.associate();

export {
  connectMongo,
  sequelize,
  mongo,
  User,
  Quizz,
  Question,
  Room,
};
