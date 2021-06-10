// hooks imports
import { useEffect, useState } from 'react';

// styles imports
import './App.css';

// request helpers
import { FetchPosts } from './helpers';

const App = () => {
    // COMPONENT STATES

    // posts
    const [posts, setPosts] = useState([]);

    // ui states
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // current page
    const [currentPage, setCurrentPage] = useState(1);

    // site data
    const [totalPages, setTotalPages] = useState();

    // buttons states
    const [isPrevDisabled, setIsPrevDisabled] = useState(false);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    // buttons array filled with idx + 1 value
    const pages = new Array(totalPages).fill(null).map((v, idx) => idx + 1);

    // COMPONENT LIFE CYCLES
    useEffect(() => {
        FetchPosts(currentPage)
            .then(res => {
                const { posts, pages } = res;

                setPosts(posts);
                setTotalPages(pages);
                setLoading(false);
            })
            .catch(err => {
                console.log('Fetch Posts Error: ', err.message);
                setError('Error sending request');
                setLoading(false);
            });

        // disable / enable buttons
        if (currentPage === 1) {
            setIsPrevDisabled(true);
        } else {
            setIsPrevDisabled(false);
        }

        if (currentPage === totalPages) {
            setIsNextDisabled(true);
        } else {
            setIsNextDisabled(false);
        }
    }, [currentPage, totalPages]);

    // EVENT HANDLERS
    const HandlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const HandleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Posts</h1>

            {/* Loading and Error message */}
            {error && <div>{error}</div>}
            {loading && <div>Loading...</div>}

            {/* Map the posts */}
            <div className="post-container">
                {posts.length ? (
                    posts.map(post => (
                        <div key={post._id} className="post">
                            <h3>{post.title}</h3>

                            <p>{post.body}</p>
                        </div>
                    ))
                ) : (
                    <div>No posts available</div>
                )}
            </div>

            {/* Buttons to switch pages */}
            <button onClick={HandlePreviousClick} disabled={isPrevDisabled}>
                Previous
            </button>

            {pages.map((pageNum, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentPage(pageNum)}
                    className={pageNum === currentPage ? 'selected' : ''}
                >
                    {pageNum}
                </button>
            ))}

            <button onClick={HandleNextClick} disabled={isNextDisabled}>
                Next
            </button>
        </div>
    );
};

export default App;
