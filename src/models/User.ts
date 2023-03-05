import { Schema, Model, model, Document } from 'mongoose';

interface UserInterface extends Document {
    user: string;
    email: string;
    password: string;
    data_bases: [number]
}

const UserSchema = new Schema<UserInterface>({
    user: String,
    email: String,
    password: String,
    data_bases: [Number]
});

const modelName: string = 'User';

const User: Model<UserInterface> = model(modelName, UserSchema);

export default User;