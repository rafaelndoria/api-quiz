import { Request, Response } from 'express';
import mongoose from 'mongoose';
import DataBase from '../models/DataBase';

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