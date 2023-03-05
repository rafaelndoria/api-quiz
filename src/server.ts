import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongoConnect } from './database/mongo';
import mainRoutes from './routes/api';

dotenv.config();

mongoConnect();

const app = express();

app.use(cors());

app.use(express.urlencoded({extended:true}));

app.use(mainRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'endpoint not found' });
});

app.listen(process.env.PORT, () => {
    console.log('server created in port 4000');
});