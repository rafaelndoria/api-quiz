import { Router } from 'express';
import { Auth } from '../middlewares/auth';
import multer from 'multer';
import * as UserController from '../controllers/userController';
import * as CreateQuizController from '../controllers/createQuiz';
import * as QuizController from '../controllers/quizController';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        let randowName = Math.floor(Math.random() * 999999);
        cb(null, `${randowName+Date.now()}`);
    },
    destination: (req, file, cb) => {
        cb(null, './src/tmp');
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
    }
});

const router = Router();

// USER
router.post('/login', UserController.login);
router.post('/create', UserController.register);
router.get('/users', UserController.allUser);
router.get('/:id/all-quizzes', UserController.showQuizzes);

// CREATE QUIZ
router.post('/:user/create/config', Auth.private, upload.single('img'), CreateQuizController.createConfig);
router.post('/:idQuiz/create/question', Auth.private, CreateQuizController.createQuestion);

// QUIZ
router.get('/quizzes', QuizController.allQuiz);
router.get('/quizzes/:id', QuizController.idQuiz);

export default router;