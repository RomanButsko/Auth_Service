import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import router from './router/index.js';
import { middlewareError } from './middlewares/error-middleware.js';
dotenv.config();

const PORT = 8080

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(middlewareError);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log('Сервер стартовал' + PORT))
    } catch(e) {
        console.log(e.message)
    } 
}

start();