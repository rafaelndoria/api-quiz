import { Request, Response } from 'express';
import * as QuizServices from '../services/QuizService';

export const search = async (req: Request, res: Response) => {
    const quiz = await QuizServices.findByText(req.params.text);

    if(quiz instanceof Error) {
        res.status(400).json({ error: quiz.message });
    } else {
        res.json({ quiz });
    }
}

export const searchTypes = async (req: Request, res: Response) => {
    const quiz = await QuizServices.findByType(req.params.type);

    if(quiz instanceof Error) {
        res.status(400).json({ error: quiz.message });
    } else {
        res.json({ quiz });
    }
}

export const order = async (req: Request, res: Response) => {
    const order = req.params.type;
    const quiz = await QuizServices.order(order);

    if(!order) {
        return res.status(400).json({ error: 'missing data' });
    }

    if(quiz instanceof Error) {
        return res.status(400).json({ error: quiz.message })
    } else {
        return res.json({ quiz });
    }
}