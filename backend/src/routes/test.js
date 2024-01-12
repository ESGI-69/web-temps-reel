import { Router } from 'express';
import testController from '../controllers/test.js';

const router = Router();

router.use('/', testController.get);

export default router;
