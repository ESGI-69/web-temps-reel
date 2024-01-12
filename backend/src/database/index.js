import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const mongoDomainName = process.env.MONGO_DATABASE_SERVICE_SERVICE_HOST || 'localhost';
const postgresDomainName = process.env.POSGRESS_DATABASE_SERVICE_SERVICE_HOST || 'localhost';

const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`);

let mongo;

const connectMongo = async () => {
  mongo = await mongoose.connect(`mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@${mongoDomainName}:27017/${process.env.MONGO_DB}`, {
    authSource: 'admin',
  });
};

export { connectMongo, sequelize, mongo };
