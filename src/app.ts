import express from 'express';

const app: express.Application = express();
const port: number = Number(process.env.PORT); // default port to listen

// define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello world3!');
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
