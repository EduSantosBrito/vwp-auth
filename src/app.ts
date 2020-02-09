import express from 'express';
import bodyParser from 'body-parser';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
}

export default new App().app;
