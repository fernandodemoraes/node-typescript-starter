import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/user.route';
import messageRouter from './routes/message.route';

export class App {
    private express: express.Application;
    private port = 8080;

    constructor() {
        this.express = express();
        this.middlewares();
        this.database();
        this.routes();
        this.listen();
    }

    public getApp(): express.Application {
        return this.express;
    }

    private middlewares(): void {
        this.express.use(express.json());
        this.express.use(cors());
    }

    private listen(): void {
        this.express.listen(this.port, () => {
            console.log('Servidor iniciado na porta ' + this.port);
        });
    }

    private database(): void {
        mongoose.connect('mongodb+srv://root:root@cluster0.zwphy.mongodb.net/<dbname>?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    }

    private routes(): void {
        this.express.use('/user', userRouter);
        this.express.use('/messages', messageRouter);
    }
}