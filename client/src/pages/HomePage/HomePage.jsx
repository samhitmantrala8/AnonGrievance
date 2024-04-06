import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineLike, AiOutlineDislike, AiOutlineDelete, AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();

        navigate('/sign-in');
    };

    const { username } = useAuth();
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState(null);
    const [messages, setMessages] = useState([]);
    const [commentInput, setCommentInput] = useState({});

    // Fetch all messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/messages/all');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Post a new message
    const postMessage = async () => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('description', description);
            formData.append('media', media);

            await axios.post('http://localhost:8800/api/messages/post', formData);
            setDescription('');
            setMedia(null);
            fetchMessages();
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    // Delete a message by ID
    const deleteMessage = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/api/messages/${id}`);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    // Add upvote to a message
    const addUpvote = async (id) => {
        try {
            await axios.put(`http://localhost:8800/api/messages/upvote/${id}`, { username });
            fetchMessages();
        } catch (error) {
            console.error('Error adding upvote:', error);
        }
    };

    // Add downvote to a message
    const addDownvote = async (id) => {
        try {
            await axios.put(`http://localhost:8800/api/messages/downvote/${id}`, { username });
            fetchMessages();
        } catch (error) {
            console.error('Error adding downvote:', error);
        }
    };

    const addComment = async (id) => {
        try {
            await axios.put(`http://localhost:8800/api/messages/comment/${id}`, { username, text: commentInput[id] });
            fetchMessages();
            setCommentInput({ ...commentInput, [id]: '' });  // Clear the comment input after adding comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const [commentInputs, setCommentInputs] = useState({});
    const [selectedMessageComments, setSelectedMessageComments] = useState({});

    // ...

    const fetchComments = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8800/api/messages/comments/${id}`);
            setSelectedMessageComments({
                ...selectedMessageComments,
                [id]: response.data
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const toggleComments = async (id) => {
        if (!selectedMessageComments[id] || selectedMessageComments[id].length === 0) {
            await fetchComments(id);
        } else {
            setSelectedMessageComments({
                ...selectedMessageComments,
                [id]: []
            });
        }
    };


    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="container py-4 text-white mx-auto flex flex-col justify-center items-center bg-black h-full w-full">
            {/* <button onClick={handleSignOut}>Sign-out</button> */}
            {/* <h1 className="text-4xl mb-4">Message Board</h1> */}

            {/* Post Message Form */}
            <div className='flex flex-col justify-center items-center bg-gray-800 p-6 rounded-lg mb-6 md:w-[500px] lg:w-[600px]'>
                <h3 className="text-xl md:text-2xl mb-2 font-mono" style={{
                    backgroundImage: 'linear-gradient(to right, red, orange, yellow, green, )',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                }}>
                    Post a Complaint
                </h3>

                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='border-2 h-8 rounded-md bg-gray-300 px-3 py-2 text-gray-800 w-full mb-4'
                />
                <input
                    type="file"
                    onChange={(e) => setMedia(e.target.files[0])}
                    className='mb-4 text-sm'
                />
                <button onClick={postMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Post
                </button>
            </div>

            {/* Display Messages */}
            <div className='md:w-[500px] flex justify-center items-center flex-col'>
                {/* <h2 className="text-2xl mb-4 flex flex-col items-center justify-center">Messages</h2> */}
                {messages.map((message, index) => {
                    const hasUpvoted = message.upvotes.includes(username);
                    const hasDownvoted = message.downvotes.includes(username);
                    const upvotesCount = message.upvotes.length;
                    const downvotesCount = message.downvotes.length;
                    return (
                        <div key={index} className='bg-gray-800 p-4 rounded-lg mb-4 w-[300px] md:w-[500px] lg:w-[600px]'>
                            <h3 className="text-sm mb-2 font-mono" style={{
                                backgroundImage: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                {message.username}
                            </h3>

                            <p className="mb-2 text-md md:text-xl">{message.description}</p>

                            <div className='w-full'>
                                {message.media && (
                                    message.media.endsWith('.mp4') ? (
                                        <video controls className='w-full mb-2' style={{ maxWidth: '100%' }}>
                                            <source src={`http://localhost:8800/uploads/${message.media}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img className='w-full h-auto mb-2 object-cover' src={`http://localhost:8800/uploads/${message.media}`} alt="Message Media" />
                                    )
                                )}
                            </div>

                            <div className="flex items-center justify-center mb-4 bg-gray-900 rounded-full">
                                <div className="flex-1 hover:bg-gray-600 transition duration-300 ease-in-out rounded-l-full">
                                    <button onClick={() => addUpvote(message._id)} className={`text-white flex justify-center items-center gap-2 text-sm md:text-xl transition duration-300 ease-in-out font-bold py-2 px-4 rounded-l-full w-full`}>
                                        <span>{hasUpvoted ? <AiFillLike /> : <AiOutlineLike />}</span><span> {upvotesCount}</span>
                                    </button>
                                </div>
                                <div className="flex-1 hover:bg-gray-600 transition duration-300 ease-in-out">
                                    <button onClick={() => addDownvote(message._id)} className={`text-white flex justify-center items-center gap-2 text-sm md:text-xl transition duration-300 ease-in-out font-bold py-2 px-4 w-full`}>
                                        <span>{hasDownvoted ? <AiFillDislike /> : <AiOutlineDislike />}</span><span> {downvotesCount}</span>
                                    </button>
                                </div>
                                <div className="flex-1 hover:bg-gray-600 transition duration-300 ease-in-out rounded-r-full">
                                    <button className={`text-white flex justify-center items-center gap-2 text-sm md:text-xl transition duration-300 ease-in-out font-bold py-2 px-4 rounded-r-full w-full`} onClick={() => toggleComments(message._id)}>
                                        Comments
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Add comment"
                                value={commentInput[message._id] || ''}
                                onChange={(e) => setCommentInput({ ...commentInput, [message._id]: e.target.value })}
                                className='border-2 h-7 md:h-11 rounded-md bg-gray-300 px-3 py-2 text-gray-800 w-full mb-2'
                            />
                            <button onClick={() => addComment(message._id)} className="bg-blue-500 font-serif hover:bg-blue-700 text-white font-bold py-1 md:py-2 px-4 text-sm md:text-md rounded">
                                Add Comment
                            </button>
                            {/* Display comments */}
                            {selectedMessageComments[message._id] && selectedMessageComments[message._id].length > 0 && selectedMessageComments[message._id].map((comment, commentIndex) => (
                                <div key={commentIndex} className='bg-gray-900 p-2 rounded-lg mb-2 mt-3 font-mono'>
                                    <p className='text-white'>{comment.text}</p>
                                    <small className='text-gray-600'>Commented by: {comment.username}</small>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );

};

export default HomePage;
