import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { verifyType } from '../helpers/verifyTypeMongo';
import * as QuizServices from '../services/QuizService';
import * as UserServices from '../services/UserService';

export const allQuiz = async (req: Request, res: Response) => {
    let quizzes = await QuizServices.all();
    res.json({ quizzes: quizzes });
}

export const idQuiz = async (req: Request, res: Response) => {
    const idQuiz = req.params.id;

    if(!idQuiz) {
        res.status(400).json({ error: 'missing data' });
    }

    if(await verifyType(idQuiz)) {
        let quiz = await QuizServices.findById(idQuiz);

        if(quiz) {
            res.json({ quiz });
        } else {
            return res.status(400).json({ error: 'quiz not exist' });
        }
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

export const filterQuiz = async (req: Request, res: Response) => {
    if(req.params.offset && req.params.pageNumber) {
        const offset = parseInt(req.params.offset);
        const page = parseInt(req.params.pageNumber);
        const quiz = await QuizServices.filterQuiz(offset, page);

        if(quiz instanceof Error) {
            return res.status(400).json({ error: quiz.message });
        } else {
            return res.json({ quiz });
        }

    } else {
        return res.status(400).json({ error: 'missing data' });
    }
}

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
    const idQuiz = req.params.idQuiz;

    if(!idQuiz) {
        return res.status(400).json({ error: 'missing data' });
    }

    if(await verifyType(idQuiz)) {
        const hasQuiz = await QuizServices.findById(idQuiz);
        if(!hasQuiz) {
            return res.status(400).json({ error: 'quiz not found' });
        } else {
            const verifyAcess = await UserServices.verifyAcessChange(req.userId as string, idQuiz);
            if(verifyAcess) {
                await QuizServices.deleteQuiz(idQuiz, req.userId as string);
                res.json({ deleted: true });
            } else {
                res.status(401).json({ error: 'not authorized, only users quiz' });
            }
        }
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

export const playQuiz = async (req: Request, res: Response) => {
    const idQuiz = req.params.idQuiz;
    
    if(!idQuiz) {
        return res.status(400).json({ error: 'missing data' });
    } 

    if(await verifyType(idQuiz)) {
        const hasQuiz = await QuizServices.findById(idQuiz);
        if(!hasQuiz) {
            return res.status(400).json({ error: 'quiz not found' });
        } else {
            const quiz = await QuizServices.playQuiz(idQuiz);
            return res.json({ questions: quiz });
        }
    } else {
    return res.status(400).json({ error: 'id is not valid' });
    }
}

export const changeQuestion = async (req: AuthRequest, res: Response) => {
    let { idQuiz, newTitle } = req.params;
    const nQuestion = parseInt(req.params.nQuestion);

    if(idQuiz && nQuestion && newTitle) {
        if(await verifyType(idQuiz)) {
            const verifyAcess = await UserServices.verifyAcessChange(req.userId as string, idQuiz);
            
            if(!verifyAcess) {
                return res.status(401).json({ error: 'not authorized' });
            }

            // max questions is 10
            if(nQuestion <= 10 && nQuestion > 0) {
                const quiz = await QuizServices.changeQuestion(nQuestion, idQuiz, newTitle);

                if(quiz instanceof Error) {
                    return res.status(400).json({ error: quiz.message });
                } else {
                    return res.json({ changed: true, newTitle: quiz });
                }
            } else {
                return res.status(400).json({ error: 'number page is not valid' });
            }
    
        } else {
            return res.status(400).json({ error: 'id is not valid' });
        }

    } else {
        return res.status(400).json({ error: 'missing data' });
    }

}

export const changeAlterntative = async (req: AuthRequest, res: Response) => {
    const { idQuiz, text } = req.params;
    const nAlternative = parseInt(req.params.nAlternative);
    const nQuestion = parseInt(req.params.nQuestion);

    if(await verifyType(idQuiz)) {
        const verifyAcess = await UserServices.verifyAcessChange(req.userId as string, idQuiz);

        if(verifyAcess) {
            // max questions:10 and max alternative:5
            if(nQuestion <= 10 && nQuestion > 0) {
                if(nAlternative <= 5 && nAlternative > 0) {
                    const quiz = await QuizServices.changeAlterntative(nQuestion, nAlternative, idQuiz, text);

                    if(quiz instanceof Error) {
                        return res.status(400).json({ error: quiz.message });
                    } else {
                        return res.json({ changed: true, quiz });
                    }
                } else {
                    return res.status(400).json({ error: 'only 5 alternatives' });
                }
            } else {
                return res.status(400).json({ error: 'only 10 questions' });
            }
        } else {
            return res.status(401).json({ error: 'not authorized' });
        }
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

export const changeCorrect = async (req: AuthRequest, res: Response) => {
    const idQuiz  = req.params.idQuiz;
    const nQuestion = parseInt(req.params.nQuestion);
    const correct = parseInt(req.params.correct);

    if(await verifyType(idQuiz)) {
        const verifyAcess = await UserServices.verifyAcessChange(req.userId as string, idQuiz);

        if(verifyAcess) {
            // max questions:10 and max alternative:5
            if(nQuestion <= 10 && nQuestion > 0) {
                if(correct <= 5 && correct > 0) {
                    const quiz = await QuizServices.changeCorrect(nQuestion, idQuiz, correct);

                    if(quiz instanceof Error) {
                        return res.status(400).json({ error: quiz.message });
                    } else {
                        return res.json({ changed: true, quiz });
                    }
                } else {
                    return res.status(400).json({ error: 'only 5 alternatives' });
                }
            } else {
                return res.status(400).json({ error: 'only 10 questions' });
            }
        } else {
            return res.status(401).json({ error: 'not authorized' });
        }
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}
