import { Router } from 'express';
import testRouter from './routes/test.js';
import roomRouter from './routes/room.js';

const router = Router();

router.use('/test', testRouter);
router.use('/room', roomRouter);

export default router;
