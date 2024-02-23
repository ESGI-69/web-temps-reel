import { Router } from 'express';
import roomRouter from './routes/room.js';
import userRouter from './routes/user.js';
import securityRouter from './routes/security.js';

const router = Router();

router.use('/room', roomRouter);
router.use('/user', userRouter);
router.use(securityRouter);

export default router;
