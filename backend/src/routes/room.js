import { Router } from 'express';
import roomController from '../controllers/room.js';
import { isLogged } from '../middlewares.js';

const router = Router();

router.get('/', isLogged, roomController.cget);
router.get('/:id', isLogged, roomController.get);
router.get('/:id/join', isLogged, roomController.join);
router.post('/', isLogged, roomController.post);
router.patch('/:id', isLogged, roomController.patch);
router.delete('/:id', isLogged, roomController.delete);

export default router;
