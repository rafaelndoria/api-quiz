import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
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

export const allUser = async (req: Request, res: Response) => {
    let users = await User.find({}, {user: 1, _id: 1});

    res.json({ users: users });
}

export const showQuizzes = async (req: Request, res: Response) => {
    let id = req.params.id;

    if(id) {
        if(mongoose.Types.ObjectId.isValid(id)) {
            let user = await User.findById(id);

            if(user) {
                res.json({ quizzes: user.data_bases });
            } else {
                return res.status(400).json({ error: 'user not exist' });
            }

        } else {
            return res.status(400).json({ error: 'id is not valid' });
        }
    } else {
        res.status(400).json({ error: 'missing data' });
    }
}

export const changeInfo = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const { newPassword, newEmail } = req.params;
    let email: boolean = false;
    let password: boolean = false;

    // verify if user dont sent any date or if send false in two parameter
    if((!newPassword && !newEmail) || (newPassword.toLowerCase() === 'false' && newEmail.toLowerCase() === 'false') || (!newEmail)) {
        return res.status(400).json({ error: 'missing data' });
    }

    // if send password, save new password in database
    if(newPassword.toLowerCase() !== 'false') {
        const hashPassword: string = await bcrypt.hash(newPassword, 10);

        await User.updateOne(
            { _id: userId },
            { password: hashPassword }
        );

        password = true;
    }

    // if send email, save new email in database
    if(newEmail.toLowerCase() !== 'false') {
        const hasEmail = await User.findOne({
            email: newEmail
        });
        if(!hasEmail) {
            await User.updateOne(
                { _id: userId },
                { email: newEmail }
            );
        } else {
            return res.status(400).json({ error: 'email already exist' });
        }

        email = true;
    }

    const user = await User.findById(userId);

    if(email && password) {
        return res.json({ changed: true, newEmail: user?.email, newPassword: user?.password });
    } else if(email) {
        return res.json({ changed: true, newEmail: user?.email })
    } else {
        return res.json({ changed: true, newPassword: user?.password })
    }
}