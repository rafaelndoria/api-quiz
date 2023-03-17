import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';
import DataBase from '../models/DataBase';
import User from '../models/User';

export const allQuiz = async (req: Request, res: Response) => {
    let quizzes = await DataBase.find({});

    res.json({ quizzes: quizzes });
}

export const idQuiz = async (req: Request, res: Response) => {
    let id = req.params.id;

    if(id) {
        if(mongoose.Types.ObjectId.isValid(id)) {
            let quiz = await DataBase.findById(id);

            if(quiz) {
                res.json({ quiz });
            } else {
                return res.status(400).json({ error: 'quiz not exist' });
            }

        } else {
            return res.status(400).json({ error: 'id is not valid' });
        }
    } else {
        res.status(400).json({ error: 'missing data' });
    }
    
}

export const filterQuiz = async (req: Request, res: Response) => {
   
    if(req.params.offset && req.params.pageNumber) {
        let offset: number = parseInt(req.params.offset);
        let pageNumber: number = parseInt(req.params.pageNumber) - 1;

        if(pageNumber >= 0) {

            let quiz = await DataBase.find({}).limit(offset).skip(pageNumber);

            res.json({ quizzes: quiz });
        } else {
            return res.status(400).json({ error: 'page invalid' });
        }

    } else {
        return res.status(400).json({ error: 'missing data' });
    }

}

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const quizId = req.params.idQuiz;
    const userQuiz = await User.findOne({
        data_bases: quizId,
        _id: userId
    });

    if (!quizId) {
        return res.status(400).json({ error: 'missing data' });
    }

    if(userQuiz) {

        await DataBase.deleteOne({
            _id: quizId
        }).then(() => {
            res.json({ delete: true });
        }).catch((err) => {
            console.log(err);
            res.json({ delete: false });
        });

    } else {
        res.status(401).json({ error: 'not authorized, only users quiz' });
    }

}

export const playQuiz = async (req: Request, res: Response) => {
    if(req.params.idQuiz) {
        const idQuiz = req.params.idQuiz;

        if(mongoose.Types.ObjectId.isValid(idQuiz)) {
            let hasQuiz = await DataBase.findById(idQuiz);

            // add more one count in plays for quiz
            if(hasQuiz) {
                let plays = hasQuiz.plays;
                hasQuiz.plays = plays + 1;
                await hasQuiz.save();

                res.json({ questions: hasQuiz.questions });

            } else {
                return res.status(400).json({ error: 'quiz not found' });
            }


        } else {
        return res.status(400).json({ error: 'id is not valid' });
        }

    } else {    
        return res.status(400).json({ error: 'missing data' });
    }
}

export const changeQuestion = async (req: AuthRequest, res: Response) => {
    let { idQuiz, nQuestion, newTitle } = req.params;

    // verify if send all parameters
    if(idQuiz && nQuestion && newTitle) {
        // verify id is valid
        if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {
            let idQuiz = req.params.idQuiz;
            let userId = req.userId;
            let hasUser = await User.findOne(
                { _id: userId, data_bases: idQuiz }
            );
            
            // check if not found quiz in the user
            if(!hasUser) {
                return res.status(401).json({ error: 'not authorized' });
            }

            // max questions is 10
            if(parseInt(nQuestion) <= 10 && parseInt(nQuestion) > 0) {
                let number: number = parseInt(nQuestion) - 1;
                let quiz = await DataBase.findById(idQuiz);

                // verify if exist question with number 
                if(quiz?.questions[number]) {

                    // change title and save in database
                    quiz.questions[number].titleAsk = newTitle;
                    await quiz.save();

                    return res.json({ newTitle: quiz.questions[number].titleAsk });

                } else {
                    return res.status(400).json({ error: 'question not exist' });
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
    const userId = req.userId;
    const { idQuiz, nAlternative, nQuestion, text } = req.params;

    // verify id is valid
    if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {
        const hasUser = await User.findById(userId);
        const quiz = await DataBase.findById(idQuiz);

        // verify id quiz exist in the user
        if(hasUser) {
            // max questions:10 and max alternative:5
            if(parseInt(nQuestion) <= 10 && parseInt(nQuestion) > 0) {
                if(parseInt(nAlternative) <= 5 && parseInt(nAlternative) > 0) {
                    let question: number = parseInt(nQuestion) - 1;
                    let alternative: number = parseInt(nAlternative) - 1;

                    // verify if exist question in quiz
                    if(quiz?.questions[question].alternative[alternative]) {

                        // change alternative and save in db
                        quiz.questions[question].alternative[alternative] = text;
                        await quiz.save()
                            .then(() => {
                                res.json({ changed: true, text });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({ changed: false });
                            });

                    } else {
                        return res.status(400).json({ error: 'question does not exist' });
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
    const userId = req.userId;
    const { idQuiz, nQuestion, correct } = req.params;

    // verify id is valid
    if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {
        const hasUser = await User.findById(userId);
        const quiz = await DataBase.findById(idQuiz);

        // verify id quiz exist in the user
        if(hasUser) {
            // max questions:10 and max alternative correct:5
            if(parseInt(nQuestion) <= 10 && parseInt(nQuestion) > 0) {
                if(parseInt(correct) <= 5 && parseInt(correct) > 0) {
                    let question: number = parseInt(nQuestion) - 1;
                    let newCorrect: number = parseInt(correct);

                    // verify if exist question in quiz
                    if(quiz?.questions[question]) {

                        // change correct and save in db
                        quiz.questions[question].correct = newCorrect;
                        await quiz.save()
                            .then(() => {
                                res.json({ changed: true, newCorrect });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json({ changed: false });
                            });

                    } else {
                        return res.status(400).json({ error: 'question does not exist' });
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