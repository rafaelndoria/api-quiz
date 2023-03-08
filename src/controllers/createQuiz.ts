import { Request, Response } from 'express';
import sharp from 'sharp';
import { unlink } from 'fs/promises';
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
                res.status(404);
                res.json({ error: 'error with uploaded file' });
            }
        } else {
            res.status(400);
            res.json({ error: 'missing data' });
        }
    } else {
        res.status(400);
        res.json({ error: 'user does not exist' });
    }
}

export const createQuestion = (req: Request, res: Response) => {
    res.json({ authorized: true, user: req.params.user, question: req.params.q });
}
