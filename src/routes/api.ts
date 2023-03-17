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
router.get('/user-:id/all-quizzes', UserController.showQuizzes);
router.put('/change-user/:newPassword?/:newEmail?', Auth, UserController.changeInfo);
router.put('/user/save/favorite/:idQuiz', Auth, UserController.saveFavorite);

// CREATE QUIZ
router.post('/:user/create/quiz/config', Auth, upload.single('img'), CreateQuizController.createConfig);
router.post('/:idQuiz/create/quiz/question', Auth, CreateQuizController.createQuestion);
router.put('/change-quiz/config/:idQuiz/:title?/:desc?/:type?', Auth, CreateQuizController.changeConfig);
router.put('/change-quiz/img/:idQuiz', upload.single('img'), Auth, CreateQuizController.changeImg);

// QUIZ
router.get('/quizzes', QuizController.allQuiz);
router.get('/quizzes/:id', QuizController.idQuiz);
router.get('/quizzes/:offset/:pageNumber', QuizController.filterQuiz);
router.get('/play/quiz/:idQuiz', QuizController.playQuiz);
router.delete('/quizzes/delete/:idQuiz', Auth, QuizController.deleteQuiz);
router.put('/change/question/:idQuiz/:nQuestion/:newTitle', Auth, QuizController.changeQuestion);
router.put('/change/alternative/:idQuiz/:nQuestion/:nAlternative/:text', Auth, QuizController.changeAlterntative);
router.put('/change/correct/:idQuiz/:nQuestion/:correct', Auth, QuizController.changeCorrect);

// SEARCH
router.get('/search/:text', SearchController.search);
router.get('/search/type/:type', SearchController.searchTypes);
router.get('/search/order/:type', SearchController.order);

export default router;