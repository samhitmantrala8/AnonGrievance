import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { HfInference } from "@huggingface/inference";
import { useDarkMode } from '../../context/DarkModeContext';
import WarningPage from './WarningPage'; // Import the warning page component

const HF_TOKEN = "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";

const inference = new HfInference(HF_TOKEN);

const HomePage = () => {
    const { logout, username } = useAuth();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState(null);
    const [messages, setMessages] = useState([]);
    const [commentInput, setCommentInput] = useState({});
    const [shouldRefresh, setShouldRefresh] = useState(false); // State variable for triggering page refresh
    const { isDarkMode } = useDarkMode();  // Using isDarkMode from context
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [selectedMessageComments, setSelectedMessageComments] = useState({}); // Initialize selectedMessageComments with an empty object


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
            const pred = await inference.textClassification({
                model: 'Utkarsh03/hb_111',
                inputs: description
            });
            pred.map((item, index) => {
                console.log(`${item.label}, ${item.score}`);
                if ((item.label === 'POSITIVE' && item.score < 0.5)) {
                    handleWarning('Please post a positive message');
                    setDescription(''); // Clear the description text
                    return;
                } else if ((item.label === 'NEGATIVE' && item.score > 0.5)) {
                    console.log('')
                } else if ((item.label === 'NEGATIVE' && item.score < 0.5)) {
                    console.log('Posting message');
                    axios.post('http://localhost:8800/api/messages/post', formData);
                    setDescription('');
                    setMedia(null);
                    setShouldRefresh(true); // Set the state variable to true to trigger page refresh
                } else if ((item.label === 'POSITIVE' && item.score > 0.5)) {
                    console.log('')
                }
            });

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
            const pred = await inference.textClassification({
                model: 'Utkarsh03/hb_111',
                inputs: commentInput[id]
            });
            let vflag = true;
            pred.forEach((item) => {
                console.log(`${item.label}, ${item.score}`);
                if ((item.label === 'POSITIVE' && item.score < 0.5)) {
                    vflag = false;
                    handleWarning('Please post a positive message');
                    return;
                } else if ((item.label === 'NEGATIVE' && item.score > 0.5)) {
                    console.log('')
                }
            });
            if (vflag) {
                await axios.put(`http://localhost:8800/api/messages/comment/${id}`, { username, text: commentInput[id] });
                fetchMessages();
                setCommentInput({ ...commentInput, [id]: '' });
            } // Clear the comment input after adding comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleWarning = (message) => {
        setWarningMessage(message);
        setShowWarning(true);
    };

    const hideWarning = () => {
        setShowWarning(false);
    };

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
    }, [shouldRefresh]); // Add shouldRefresh to the dependency array

    useEffect(() => {
        if (shouldRefresh) {
            setShouldRefresh(false); // Reset the state variable to false after refresh
        }
    }, [shouldRefresh]);

    return (
        <div className={`container py-4 mx-auto flex flex-col justify-center items-center h-full w-full ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {/* Post Message Form */}
            <div className={`flex flex-col justify-center items-center p-6 rounded-lg mb-6 md:w-[500px] lg:w-[600px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <h2 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Post a Message</h2>
                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`border-2 h-8 rounded-md px-3 py-2 w-full mb-4 ${isDarkMode ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-700'}`}
                />
                <input
                    type="file"
                    onChange={(e) => setMedia(e.target.files[0])}
                    className={`mb-4 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
                />
                <button onClick={postMessage} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Post
                </button>
            </div>

            {/* Display Messages */}
            <div className='md:w-[500px] flex justify-center items-center flex-col'>
                {messages.map((message, index) => {
                    const hasUpvoted = message.upvotes.includes(username);
                    const hasDownvoted = message.downvotes.includes(username);

                    // Count the number of upvotes and downvotes
                    const upvotesCount = message.upvotes.length;
                    const downvotesCount = message.downvotes.length;
                    return (
                        <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg mb-4 w-[300px] md:w-[500px] lg:w-[600px] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <h3 className="text-sm mb-2">{message.username}</h3>
                            <p className="mb-2 text-xl">{message.description}</p>

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

                            <div className={`flex  items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                                <div className="flex-1  transition duration-300 ease-in-out rounded-l-full">
                                    <button onClick={() => addUpvote(message._id)} className={`${isDarkMode ? 'text-white' : 'text-black'} flex ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-300'} justify-center items-center gap-2 text-sm md:text-xl transition duration-300 ease-in-out font-bold py-2 px-4 rounded-l-full w-full`}>
                                        <span>{hasUpvoted ? <AiFillLike /> : <AiOutlineLike />}</span><span> {upvotesCount}</span>
                                    </button>
                                </div>
                                <div className="flex-1  transition duration-300 ease-in-out">
                                    <button onClick={() => addDownvote(message._id)} className={`${isDarkMode ? 'text-white' : 'text-black'} ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-300'} flex justify-center items-center gap-2 text-sm md:text-xl transition duration-300 ease-in-out font-bold py-2 px-4 w-full`}>
                                        <span>{hasDownvoted ? <AiFillDislike /> : <AiOutlineDislike />}</span><span> {downvotesCount}</span>
                                    </button>
                                </div>
                                <div className="flex-1  transition duration-300 ease-in-out rounded-r-full">
                                    <button className={`${isDarkMode ? 'text-white' : 'text-black'} flex ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-300'} justify-center items-center gap-2 text-sm md:text-lg transition duration-300 ease-in-out font-bold py-2 px-4 rounded-r-full w-full`} onClick={() => toggleComments(message._id)}>
                                        Comments
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Add comment"
                                value={commentInput[message._id] || ''}
                                onChange={(e) => setCommentInput({ ...commentInput, [message._id]: e.target.value })}
                                className='border-2 rounded-md bg-gray-300 px-3 py-2 text-gray-800 w-full mb-2'
                            />
                            <button onClick={() => addComment(message._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Comment
                            </button>
                            {/* Display comments */}
                            {selectedMessageComments[message._id] && selectedMessageComments[message._id].length > 0 && selectedMessageComments[message._id].map((comment, commentIndex) => (
                                <div key={commentIndex} className={`${isDarkMode ? 'bg-gray-700 border-white' : 'bg-gray-300 border-black'} p-2 rounded-lg mb-2 mt-3 border-2`}>
                                    <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{comment.text}</p>
                                    <small className='text-gray-900'>Commented by: {comment.username}</small>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            {/* Render the warning page if showWarning is true */}
            {showWarning && <WarningPage message={warningMessage} onClose={hideWarning} />}
        </div>
    );

};

export default HomePage;
