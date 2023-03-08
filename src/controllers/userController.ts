import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User';

dotenv.config();

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;
        let hasUser = await User.findOne({
            email
        });

        if(hasUser) {
            let passwordCorrect = await bcrypt.compare(password, hasUser.password);

            if(passwordCorrect) {
                const token = JWT.sign(
                    { id: hasUser.id, email: hasUser.email },
                    process.env.JWT_SECRET_KEY as string,
                    { expiresIn: '2h' }
                );

                res.json({ login: true, token: token });
            } else {
                res.status(404).json({ error: 'password is not correct' });
            }

        } else {
            res.status(400).json({ error: 'user does not exists' });
        }

    } else {
        res.status(400).json({ error: 'missing data' });
    }
}

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password && req.body.user) {
        let { user, email, password } = req.body;
        let hasUserEmail = await User.findOne({
            email
        });
        let hasUserName = await User.findOne({
            user
        });

        if(hasUserEmail || hasUserName) {
            res.status(400).json({ error: 'email or user already exists' });
        } else {
            let hashPassword: string = await bcrypt.hash(password, 10);
            let newUser = await User.create({
                user,
                email,
                password: hashPassword
            });

            const token = JWT.sign(
                {id: newUser.id, email: newUser.email},
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' }
            );

            res.json({ newUser: newUser, token: token });
        }

    } else {
        res.status(400).json({ error: 'missing data' });
    }
}