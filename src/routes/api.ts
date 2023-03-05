import { Router } from 'express';
import * as UserController from '../controllers/userController';

const router = Router();

// USER
router.post('/login', UserController.login);
router.post('/register', UserController.register);

export default router;