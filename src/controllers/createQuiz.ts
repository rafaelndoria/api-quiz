import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { unlink } from 'fs/promises';
import { verifyType } from '../helpers/verifyTypeMongo';
import * as QuizService from '../services/QuizService';
import * as UserService from '../services/UserService';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

export const createConfig = async (req: AuthRequest, res: Response) => {
    let hasUser = await UserService.findUserById(req.userId as string);

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
                let newQuiz = await QuizService.createConfig(title, desc, type, filename);
                
                // save new quiz in the user
                UserService.addQuizInUser(req.userId as string, newQuiz.id);
         
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
    const idQuiz = req.params.idQuiz;
    const quiz = await QuizService.findById(idQuiz);

    if(!await verifyType(idQuiz)) {
        return res.status(400).json({ error: 'id is not valid' });
    } 

    if(quiz) {
        let {title, correct, a1, a2, a3, a4, a5} = req.body;

        if(title && correct && a1 && a2 && a3 && a4 && a5) {
            let questions = await QuizService.createQuestion(idQuiz, title, correct, a1, a2, a3, a4, a5);
            
            if(questions instanceof Error) {
                return res.status(400).json({ error: questions.message });
            } else {
                return res.json({ added: true });
            }
            
        } else {
            res.status(400).json({ error: 'missing data' });
        }
    } else {
        res.status(400).json({ error: 'quiz does not exist' });
    }
}

export const changeConfig = async (req: AuthRequest, res: Response) => {
    const idQuiz = req.params.idQuiz;
    const canChange = await UserService.verifyAcessChange(req.userId as string, idQuiz);
    const { title, desc, type } = req.params;

    if(!canChange) {
        return res.status(401).json({ error: 'not authorized' });
    }

    if(await verifyType(idQuiz)) {
        if(title && desc && type) {
            if(title.toLowerCase() === 'false' && desc.toLowerCase() === 'false' && type.toLowerCase() === 'false') {
                return res.status(400).json({ error: 'nothing parameter for to change' });
            }
        }
        if(!title && !desc && !type) {
            return res.status(400).json({ error: 'missing data' });
        }

        // if parameter is not false, so update in database
        if(title.toLowerCase() !== 'false') {
            await QuizService.changeInfo.changeTitle(idQuiz, title);
        }
        if(desc.toLowerCase() !== 'false') {
            await QuizService.changeInfo.changeDesc(idQuiz, desc);
        }
        if(type.toLowerCase() !== 'false') {
            await QuizService.changeInfo.changeType(idQuiz, type);
        }

        res.json({ changed: true });
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

export const changeImg = async (req: AuthRequest, res: Response) => {
    const idQuiz = req.params.idQuiz;
    const canChange = await UserService.verifyAcessChange(req.userId as string, idQuiz);

    if(!canChange) {
        return res.status(401).json({ error: 'not authorized' });
    }

    if(await verifyType(idQuiz)) {
        const quiz = await QuizService.findById(idQuiz);
        if(!quiz) {
            return res.status(400).json({ error: 'quiz not found' });
        }

        if(req.file) {   
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

            await QuizService.changeInfo.changeFileNameImg(idQuiz, filename);

            res.json({ changed: true, filename });
        } else {
            return res.status(400).json({ error: 'not send img' });
        }
    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

