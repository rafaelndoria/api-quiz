import express, { Request, Response, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MulterError } from 'multer';
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

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400);

    if(err instanceof MulterError) {
        res.json({ error: err.code });
    } else {
        console.log( err );
        res.json({ error: 'an unexpected error occurred' })
    }

}
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('server created in port 4000');
});