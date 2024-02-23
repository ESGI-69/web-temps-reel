import { Router } from 'express';

import quizzController from '../controllers/quizz.js';
import { isAdmin, isLogged } from '../middlewares.js';

const router = Router();

router.get('/', isLogged, quizzController.cget);
router.get('/:id', isLogged, quizzController.get);
router.post('/', isAdmin, quizzController.post);
router.patch('/:id', isAdmin, quizzController.patch);
router.delete('/:id', isAdmin, quizzController.delete);

export default router;
