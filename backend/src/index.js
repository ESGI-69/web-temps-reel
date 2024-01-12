import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import dotenv from 'dotenv';

import routes from './routes.js';
import errorHandler from './errorHandler.js';
import { populateUser } from './middlewares.js';
import initSocket from './socket/index.js';

dotenv.config();

const app = express();
const server = createHttpServer(app);

const io = new SocketIoServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});
initSocket();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(populateUser);
app.use(process.env.BASE_PATH || '/', routes);
app.use(errorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port 3000');
  // eslint-disable-next-line no-console
  console.log(`Posgress database URL: ${process.env.POSGRESS_DATABASE_SERVICE_SERVICE_HOST || 'localhost'}:${process.env.POSGRESS_DATABASE_SERVICE_SERVICE_PORT || 5432}`);
  // eslint-disable-next-line no-console
  console.log(`Mongo database URL: ${process.env.MONGO_DATABASE_SERVICE_SERVICE_HOST || 'localhost'}:${process.env.MONGO_DATABASE_SERVICE_SERVICE_PORT || 27017}`);
});

export { io };
