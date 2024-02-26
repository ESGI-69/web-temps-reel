import { Router } from 'express';
import roomController from '../controllers/room.js';
import { isLogged, isUserInRoom, isUserRoomStarted } from '../middlewares.js';

const router = Router();

router.get('/', isLogged, roomController.cget);
router.get('/leave', isLogged, roomController.leave);
router.get('/:id', isLogged, roomController.get);
router.patch('/:id/join', isLogged, roomController.join);
router.post('/', isLogged, roomController.post);
router.patch('/:id', isLogged, roomController.patch);
router.patch('/:id/start', isLogged, roomController.start);
router.post('/:id/answer', isLogged, isUserInRoom, isUserRoomStarted, roomController.answer);
router.delete('/:id', isLogged, roomController.delete);

export default router;
