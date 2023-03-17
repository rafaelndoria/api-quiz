import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { unlink } from 'fs/promises';
import fs from 'fs';
import sharp from 'sharp';
import mongoose from 'mongoose';
import path from 'path'; 
import DataBase from '../models/DataBase';
import User from '../models/User';

interface AlternativeInstances {
    title: string,
    correct: number,
    a1: string,
    a2: string,
    a3: string,
    a4: string,
    a5: string
}

export const createConfig = async (req: AuthRequest, res: Response) => {
    let userId = req.userId;
    let hasUser = await User.findById(userId);

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

export const changeConfig = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const { title, desc, type } = req.params;

    // verify id
    if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {
        const idQuiz = req.params.idQuiz;
        const user = await User.findOne({
            _id: userId,
            data_bases: idQuiz
        });

        // verify if exist user
        if(!user) {
            return res.status(401).json({ error: 'not authorized' });
        }

        // check if all parameters are false
        if(title && desc && type) {
            if(title.toLowerCase() === 'false' && desc.toLowerCase() === 'false' && type.toLowerCase() === 'false') {
                return res.status(400).json({ error: 'nothing parameter for to change' });
            }
        }

        // check if all parameter are dont send
        if(!title && !desc && !type) {
            return res.status(400).json({ error: 'missing data' });
        }

        // if parameter is not false, so update in database
        if(title.toLowerCase() !== 'false') {
            await DataBase.updateOne(
                { _id: idQuiz },
                { title }
            );
        }
        if(desc.toLowerCase() !== 'false') {
            await DataBase.updateOne(
                { _id: idQuiz },
                { desc }
            );
        }
        if(type.toLowerCase() !== 'false') {
            await DataBase.updateOne(
                { _id: idQuiz },
                { type }
            );
        }

        let quiz = await DataBase.findById(idQuiz);
        res.json({ changed: true, quiz });
        

    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }

}

export const changeImg = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    // verify if id is valid
    if(mongoose.Types.ObjectId.isValid(req.params.idQuiz)) {

        // checks if img is being sent in the request
        if(req.file) {
            const idQuiz = req.params.idQuiz;
            const user = await User.findOne({ _id: userId, data_bases: idQuiz });
            const quiz = await DataBase.findById(idQuiz);

            // verify if quiz exist
            if(!quiz) {
                return res.status(400).json({ error: 'quiz not found' });
            }

            if(user) {
            const oldImgName = quiz.img;
            const pathImg = path.join(__dirname, '../../public/media', oldImgName);

            // checks if there is an image for that quiz, if it exists, delete it 
            fs.access(pathImg, fs.constants.F_OK, async (err) => {
                if(!err) {
                    await unlink(pathImg);
                }
            });

            // add new img in public/media and delete img in tmp
            let filename = `${req.file.filename}.jpg`;
            await sharp(req.file.path)
                .resize(500)
                .toFormat('jpeg')
                .toFile(`./public/media/${filename}`);
            
            await unlink(req.file.path);
            
            // save filename img in database
            await DataBase.updateOne(
                { _id: idQuiz },
                { img: filename }
            );
        
            res.json({ changed: true, filename });

            } else {
                return res.status(401).json({ error: 'not authorized' });
            }

        } else {
            return res.status(400).json({ error: 'not send img' });
        }
        
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
 
}