import { Router } from 'express';

import questionController from '../controllers/question.js';
import { isAdmin, isLogged } from '../middlewares.js';

const router = Router();

router.get('/', isLogged, questionController.cget);
router.get('/:id', isLogged, questionController.get);
router.post('/', isAdmin, questionController.post);
router.patch('/:id', isAdmin, questionController.patch);
router.delete('/:id', isAdmin, questionController.delete);
