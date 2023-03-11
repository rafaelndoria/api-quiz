import { Request, Response } from 'express';
import DataBase from '../models/DataBase';

export const search = async (req: Request, res: Response) => {
    let text = req.params.text;
    let regex = new RegExp(text, 'i');
    let quiz = await DataBase.find({
        $or: [{ title: regex }, { desc: regex }]
    });

    if(quiz.length >= 1) {
        res.json({ quiz });
    } else {
        res.status(400).json({ error: 'parameter not found' });
    }
}

export const searchTypes = async (req: Request, res: Response) => {
    let search = req.params.type;

    let quiz = await DataBase.find({
        type: search
    });

    if(quiz.length >= 1) {
        res.json({ quiz: quiz });
    } else {
        res.json({ error: 'quizs type does not exist' });
    }
}

export const order = async (req: Request, res: Response) => {
    const order = req.params.type;

    if(!order) {
        return res.status(400).json({ error: 'missing data' });
    }

    if(order.toLowerCase() === 'most' || order.toLowerCase() === 'less') {
        
        if(order.toLowerCase() === 'most') {
            let quiz = await DataBase.find({}).sort({ plays: -1 });
            res.json({ quiz });
        } else {
            let quiz = await DataBase.find({}).sort({ plays: 1 });
            res.json({ quiz });
        }
        

    } else {
        return res.status(400).json({ error: 'order type invalid, only most or less' });
    }
}