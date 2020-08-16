
const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('<H1>Tessagon</H1>')
});

const userRouter = require("./routes/userRouter.js");

app.use('/user', userRouter);

app.listen(3000, () => {
    console.log('Tessagon is listening on port 3000!')
});