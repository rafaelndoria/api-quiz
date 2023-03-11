import { Schema, Model, model, Document } from 'mongoose';

interface DataBaseInterface extends Document {
    title: string,
    desc: string,
    img: string,
    type: string,
    plays: number,
    questions: [
        {
            titleAsk: string,
            alternative: [string, string, string, string, string],
            correct: number
        }
    ]
}

const DBSchema = new Schema<DataBaseInterface>({
    title: String,
    desc: String,
    img: String,
    type: String,
    plays: { type: Number, default: 0 },
    questions: [
        {
            titleAsk: String,
            alternative: [String, String, String, String, String],
            correct: Number
        }
    ]
});

const modelName: string = 'DataBase';

const DataBase: Model<DataBaseInterface> = model ('DataBases', DBSchema);

export default DataBase;