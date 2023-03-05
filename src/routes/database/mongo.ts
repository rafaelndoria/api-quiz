import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);
export const mongoConnect = async () => {
    try {

        console.log('connecting MongoDB');
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('sucess');

    } catch(error) {
        console.log('connection error: ', error);
    }
}