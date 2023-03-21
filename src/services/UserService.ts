import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User';

export const findUserByEmail = async (email: string) => {
    const user = await User.findOne({
        email
    });

    return user;
}

export const findUserByUser = async (username: string) => {
    const user = await User.findOne({
        user: username
    });

    return user;
}

export const findUserById = async (id: string) => {
    const user = await User.findById(id);

    return user;
}

export const matchPassword = async (passwordText: string, encrypted: string) => {
    return bcrypt.compareSync(passwordText, encrypted);
}

export const registerUser = async (password: string, email: string, username: string) => {
    const hash = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
        email,
        password: hash,
        user: username
    });

    return newUser;
}

export const all = async () => {
    return await User.find({}, {user: 1, _id: 1});
}

export const verifyIdUser = async (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
}

export const changeInfo = {
    changePassword: async (id: string, password: string) => {
        const hash = bcrypt.hashSync(password, 10);

        await User.updateOne(
            { _id: id },
            { password: hash }
        );

        return true;
    },
    changeEmail: async (id: string, email: string) => {
        const userEmail = await findUserByEmail(email);

        if(!userEmail) {
            await User.updateOne(
                { _id: id },
                { email }
            );

            return true;
        } else {
            return new Error('email already exists');
        }
    }
}