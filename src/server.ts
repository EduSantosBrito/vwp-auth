import express from 'express';
import app from './app';
import Client from './Db/Client';
import AuthRouter from './Controllers/auth';

const port: number = Number(process.env.PORT);

try {
    app.use('/auth', AuthRouter);
} catch (error) {
    console.log({ error: error.message });
}

app.listen(port, async () => {
    try {
        await Client.connect();
        console.log(`Connect to DB`);
        console.log(`Server started at http://localhost:${port}`);
    } catch (error) {
        throw new Error(error);
    }
});
