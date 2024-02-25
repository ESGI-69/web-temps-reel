import { Router } from 'express';
import chatController from '../controllers/chat.js';
import { isLogged } from '../middlewares.js';

const router = Router();

router.post('/', isLogged, chatController.post);

export default router;
