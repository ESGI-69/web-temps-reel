import { Router } from 'express';
import testRouter from './routes/test.js';

const router = Router();

router.use('/test', testRouter);

export default router;
