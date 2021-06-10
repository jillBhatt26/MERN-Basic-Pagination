// imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// app init
const app = express();

// env config
dotenv.config();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema definition
const PostSchema = new mongoose.Schema({
    title: String,
    body: String
});

const Posts = mongoose.model('Post', PostSchema);

// routes
// fetch all posts
app.get('/posts', async (req, res) => {
    // fetch the page from query string
    const page = parseInt(req.query.page || '1') - 1;

    // define number of posts per page
    const POSTS_PER_PAGE = 3;

    try {
        // query the collection
        const posts = await Posts.find({})
            .limit(POSTS_PER_PAGE) // only show n posts per page
            .skip(page * POSTS_PER_PAGE); // skip first n * page posts to avoid repetition

        // total documents in collection
        const total = await Posts.countDocuments();

        // total pages
        const pages = Math.ceil(total / POSTS_PER_PAGE);

        return res.json({ total, pages, posts });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

// add new post
app.post('/posts', async (req, res) => {
    const { title, body } = req.body;

    try {
        const newPost = await Posts.create({ title, body });

        return res.json({ newPost });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

// connect and listen
mongoose
    .connect(process.env.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        const PORT = process.env.PORT;
        const HOST = process.env.HOST;

        app.listen(PORT, HOST, err => {
            if (err) console.log('Hosting Error: ', err.message);
            else {
                console.log(`Server hosted on ${HOST}:${PORT}`);
            }
        });
    });
