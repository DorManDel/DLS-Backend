require('dotenv').config();
const express = require('express');
const app = express()
const port = process.env.PORT || 8080
const { postsController } = require('./postsController.js');
const { dbConnection } = require('./dbConnection.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/posts', async (req, res) => {
//     res.status(200).send(await postsController.getPosts());
// });

app.get('/', async (req, res) => {
    res.status(200).send(await postsController.getallusers());
});

// app.post('/posts', async (req, res) => { });

// app.put('/posts/:postId', async (req, res) => { });

// app.delete('/posts/:postId', async (req, res) => { });

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})