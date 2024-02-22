import { Router } from 'express';
import roomController from '../controllers/room.js';

const router = Router();

router.get('/', roomController.get);

router.get('/:id', roomController.getRoom);

router.post('/join', roomController.createRoom);

export default router;
