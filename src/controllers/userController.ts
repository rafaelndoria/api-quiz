import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { verifyType } from '../helpers/verifyTypeMongo';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as UserServices from '../services/UserService';
import * as QuizServices from '../services/QuizService';

dotenv.config();

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;
        let user = await UserServices.findUserByEmail(email);
        
        if(user) {
            let passwordCorrect = await UserServices.matchPassword(password, user.password);

            if(passwordCorrect) {
                const token = JWT.sign(
                    { id: user.id, email: user.email },
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
        let hasEmail = await UserServices.findUserByEmail(email);
        let hasUser = await UserServices.findUserByUser(user);

        if(hasEmail || hasUser) {
            res.status(400).json({ error: 'email or user already exists' });
        } else {
            const newUser = await UserServices.registerUser(password, email, user);
            const token = JWT.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' }
            );
            res.status(401).json({ newUser: newUser, token });
        }

    } else {
        res.status(400).json({ error: 'missing data' });
    }
}

export const allUser = async (req: Request, res: Response) => {
    let users = await UserServices.all();

    res.json({ users: users });
}

export const showQuizzes = async (req: Request, res: Response) => {
    const id = req.params.id;
    const idValid = await verifyType(id);

    if(id) {
        if(idValid) {
            const user = await UserServices.findUserById(id);

            if(user) {
                res.json({ quizzes: user.data_bases }); 
            } else {
                return res.status(400).json({ error: 'user not exist' });
            }

        } else {
            return res.status(400).json({ error: 'id is not valid' });
        }
    } else {
        return res.status(400).json({ error: 'missing data' });
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
        password = await UserServices.changeInfo.changePassword(userId as string, newPassword);
    }

    // if send email, save new email in database
    if(newEmail.toLowerCase() !== 'false') {
        let changedEmail = await UserServices.changeInfo.changeEmail(userId as string, newEmail);
        if(changedEmail instanceof Error) {
            return res.status(400).json({ error: changedEmail.message });
        }
        email = true;
    }

    if(email && password) {
        return res.json({ changed: 'password and email'});
    } else if(email) {
        return res.json({ changed: 'email'});
    } else {
        return res.json({ changed: 'password' });
    }
}

export const saveFavorite = async (req: AuthRequest, res: Response) => {
    const idQuiz = req.params.idQuiz;

    // verify if id is valid
    if(await verifyType(idQuiz)) {
        const user = await UserServices.findUserById(req.userId as string);
        const quiz = await QuizServices.findById(idQuiz);

        // verify if user exist
        if(user) {
            // verify if quiz exist, because dont will save a quiz that does not exist
            if(quiz) {
                // adding favorite quiz in field favorites the user
                await UserServices.addQuizInUser(req.userId as string, idQuiz);

                return res.json({ idQuiz, favorites: user.favorites });
            } else {
                return res.status(400).json({ error: 'quiz does not exist' });
            }
        }

    } else {
        return res.status(400).json({ error: 'id is not valid' });
    }
}

export const showProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    const user = await UserServices.findUserById(userId as string);

    res.json({ user });
}