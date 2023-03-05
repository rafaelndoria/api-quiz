import { Router } from 'express';
import { Auth } from '../middlewares/auth';
import * as UserController from '../controllers/userController';
import * as QuizController from '../controllers/createQuiz';

const router = Router();

// USER
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// CREATE QUIZ
router.get('/:user/create/config', Auth.private, QuizController.createConfig);
router.get('/:user/create/question-:q', Auth.private, QuizController.createQuestion);

export default router;