import express from 'express';
import * as UserController from '../controllers/userController.js';                                

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.delete('/:id', UserController.remove);
router.patch('/:id/status', UserController.changeStatus);
router.put('/:id', UserController.update);

export default router;
