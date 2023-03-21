import mongoose from 'mongoose';

export const verifyType = async (id: string) => {
    let isValid: boolean = await mongoose.Types.ObjectId.isValid(id)
    return isValid;
}