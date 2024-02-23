import { Router } from 'express';
import roomController from '../controllers/room.js';
import { isLogged } from '../middlewares.js';

const router = Router();

router.get('/', isLogged, roomController.get);
router.get('/:id', isLogged, roomController.getRoom);
router.post('/join', isLogged, roomController.createRoom);

export default router;
