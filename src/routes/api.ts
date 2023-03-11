import { Router } from 'express';
import { Auth } from '../middlewares/auth';
import multer from 'multer';
import * as UserController from '../controllers/userController';
import * as CreateQuizController from '../controllers/createQuiz';
import * as QuizController from '../controllers/quizController';
import * as SearchController from '../controllers/searchController';

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
router.put('/change/:newPassword?/:newEmail?', Auth, UserController.changeInfo);

// CREATE QUIZ
router.post('/:user/create/quiz/config', Auth, upload.single('img'), CreateQuizController.createConfig);
router.post('/:idQuiz/create/quiz/question', Auth, CreateQuizController.createQuestion);

// QUIZ
router.get('/quizzes', QuizController.allQuiz);
router.get('/quizzes/:id', QuizController.idQuiz);
router.get('/quizzes/:offset/:pageNumber', QuizController.filterQuiz);
router.get('/play/quiz/:idQuiz', QuizController.playQuiz);
router.delete('/quizzes/delete/:idQuiz', Auth, QuizController.deleteQuiz);

// SEARCH
router.get('/search/:text', SearchController.search);
router.get('/search/type/:type', SearchController.searchTypes);

export default router;