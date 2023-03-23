import mongoose from 'mongoose';

export const verifyType = async (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
}