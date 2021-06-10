import axios from 'axios';

const FetchPosts = async page => {
    const postsRes = await axios({
        url: `http://localhost:5000/posts?page=${page}`
    });

    const { error } = postsRes.data;

    if (error) {
        return {
            error: error.message
        };
    }

    return {
        posts: postsRes.data.posts,
        pages: postsRes.data.pages,
        total: postsRes.data.total
    };
};

export { FetchPosts };
