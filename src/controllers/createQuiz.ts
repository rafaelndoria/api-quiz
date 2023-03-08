import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import mongoose from 'mongoose';
import DataBase from '../models/DataBase';
import User from '../models/User';

export const createConfig = async (req: Request, res: Response) => {
    let user = req.params.user;
    let hasUser = await User.findOne({ user });

    if(hasUser) {
        if(req.body.title && req.body.desc && req.body.type) {
            if(req.file) {
                let {title, desc, type} = req.body;
                const filename = `${req.file.filename}.jpg`;

                // save img in public/media and delete img from /tmp
                await sharp(req.file.path)
                    .resize(500)
                    .toFormat('jpeg')
                    .toFile(`./public/media/${filename}`);

                await unlink(req.file.path);

                // create new quiz
                let newQuiz = await DataBase.create({
                    title,
                    desc,
                    type,
                    img: filename
                });

                // save new quiz in the user
                hasUser.data_bases.push(newQuiz.id);
                await hasUser.save();
                
                res.json({ quiz: newQuiz, userId: hasUser.id });

            } else {
                res.status(400).json({ error: 'error with uploaded file' });
            }
        } else {
            res.status(400).json({ error: 'missing data' });
        }
    } else {
        res.status(400).json({ error: 'user does not exist' });
    }
}

export const createQuestion = async (req: Request, res: Response) => {
    let quiz;

    interface AlternativeInstances {
        title: string,
        correct: number,
        a1: string,
        a2: string,
        a3: string,
        a4: string,
        a5: string
    }

    if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {
        quiz = await DataBase.findOne({
            _id: req.params.idQuiz
        });
    } else {
        res.status(400).json({ error: 'id is not valid' });
        return;
    }

    if(quiz) {
        let {title, correct, a1, a2, a3, a4, a5}: AlternativeInstances = req.body;

        if(title && correct && a1 && a2 && a3 && a4 && a5) {
            let lengthQuiz = quiz.questions.length;

            if(lengthQuiz <= 9) {
                quiz.questions.push({
                    titleAsk: title,
                    alternative: [a1,a2,a3,a4,a5],
                    correct: correct
                });
                await quiz.save();
    
                res.json({ quiz: quiz.questions });
            } else {
                res.status(400).json({ error: 'the quiz limit has been reached' });
            }
            
        } else {
            res.status(400).json({ error: 'missing data' });
        }
    } else {
        res.status(400).json({ error: 'quiz does not exist' });
    }
}

