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

/* need to implement the logic for when the db returned tht the user already exists and return an error message to the client, and also for when the user is successfully created and return a success message to the client */
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const result = await postsController.getSignupPost(username, password);
    res.status(200).send(await result);
});
// app.post('/posts', async (req, res) => { });

// app.put('/posts/:postId', async (req, res) => { });

// app.delete('/posts/:postId', async (req, res) => { });

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})