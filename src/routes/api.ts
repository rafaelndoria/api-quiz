import { Router } from 'express';
import { Auth } from '../middlewares/auth';
import multer from 'multer';
import * as UserController from '../controllers/userController';
import * as QuizController from '../controllers/createQuiz';

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
router.post('/register', UserController.register);

// CREATE QUIZ
router.post('/:user/create/config', Auth.private, upload.single('img'), QuizController.createConfig);
router.post('/:user/create/question-:q', Auth.private, QuizController.createQuestion);

export default router;