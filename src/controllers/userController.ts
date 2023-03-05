import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const login = (req: Request, res: Response) => {

}

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password && req.body.user) {
        let {user, email, password} = req.body;
        let hasUser = await User.findOne({
            email
        });

        if(hasUser) {
            res.status(400);
            res.json({ error: 'email already exists' });
        } else {
            let hashPassword: string = await bcrypt.hash(password, 10);
            let newUser = await User.create({
                user,
                email,
                password: hashPassword
            });

            res.json({ newUser: newUser });
        }

    } else {
        res.status(400);
        res.json({ error: 'missing data' });
    }
}