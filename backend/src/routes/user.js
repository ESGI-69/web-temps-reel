import { Router } from 'express';

import userController from '../controllers/user.js';
import { isLogged } from '../middlewares.js';

const router = Router();

router.get('/me', isLogged, userController.me);
router.post('/', userController.post);

export default router;
