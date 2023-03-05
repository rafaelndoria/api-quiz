import { Request, Response } from 'express';
import DataBase from '../models/DataBase';

export const createConfig = (req: Request, res: Response) => {
    res.json({ authorized: true, user: req.params.user });
}

export const createQuestion = (req: Request, res: Response) => {
    res.json({ authorized: true, user: req.params.user, question: req.params.q });
}