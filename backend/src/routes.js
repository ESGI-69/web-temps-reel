import { Router } from 'express';
import roomRouter from './routes/room.js';
import userRouter from './routes/user.js';
import quizzRouter from './routes/quizz.js';
import questionRouter from './routes/question.js';
import securityRouter from './routes/security.js';
import chatRouter from './routes/chat.js';

const router = Router();

router.use('/room', roomRouter);
router.use('/user', userRouter);
router.use('/quizz', quizzRouter);
router.use('/question', questionRouter);
router.use('/chat', chatRouter);
router.use(securityRouter);

export default router;
