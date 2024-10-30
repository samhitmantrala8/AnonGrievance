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
    const [selectedMessageComments, setSelectedMessageComments] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/messages/all');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const postMessage = async () => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('description', description);
            formData.append('media', media);
            const pred = await inference.textClassification({
                model: 'samhitmantrala/hk111',
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

    const deleteMessage = async (messageId) => {
        try {
            const response = await axios.delete(`http://localhost:8800/api/messages/${messageId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you send the token
                },
            });
            console.log(response.data);
            fetchMessages(); // Fetch messages after deletion
            // Handle successful deletion, e.g., update the state to remove the deleted message
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };


    const addUpvote = async (id) => {
        try {
            await axios.put(`http://localhost:8800/api/messages/upvote/${id}`, { username });
            fetchMessages();
        } catch (error) {
            console.error('Error adding upvote:', error);
        }
    };

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
                model: 'samhitmantrala/hk111',
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
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleWarning = (message) => {
        setWarningMessage(message);
        setShowWarning(true);
        setCommentInput({});
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

    const complaintsPerPage = 6;
    const startIndex = (currentPage - 1) * complaintsPerPage;
    const currentMessages = messages.slice(startIndex, startIndex + complaintsPerPage);

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="flex-grow flex flex-col items-center justify-start p-4">
                <h2 className="text-2xl mb-4 text-center">Current/Ongoing Issues</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                    {currentMessages.map((message, index) => (
                        <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg w-full ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <h3 className="text-sm mb-2">{message.username}</h3>
                            <p className="mb-2 text-xl">{message.description}</p>
    
                            {message.media && (
                                message.media.endsWith('.mp4') ? (
                                    <video controls className='w-full mb-2'>
                                        <source src={`http://localhost:8800/uploads/${message.media}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img className='w-full h-auto mb-2 object-cover' src={`http://localhost:8800/uploads/${message.media}`} alt="Message Media" />
                                )
                            )}
    
                            
    
                            <input
                                type="text"
                                placeholder="Add comment"
                                value={commentInput[message._id] || ''}
                                onChange={(e) => setCommentInput({ ...commentInput, [message._id]: e.target.value })}
                                className='border-2 rounded-md bg-gray-300 px-3 py-2 text-gray-800 w-full mb-2'
                            />
                            
                            <button onClick={() => toggleComments(message._id)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-2 rounded">
                                Show Comments
                            </button>
                            <span className="mx-2"></span>
                            <button onClick={() => addComment(message._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Comment
                            </button>
    
                            {selectedMessageComments[message._id] && selectedMessageComments[message._id].map((comment, commentIndex) => (
                                <div key={commentIndex} className={`${isDarkMode ? 'bg-gray-700 border-white' : 'bg-gray-300 border-black'} p-2 rounded-lg mb-2 mt-3 border-2`}>
                                    <p>{comment.text}</p>
                                    <small>Commented by: {comment.username}</small>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
    
                <div className="flex justify-between items-center mt-4 w-full px-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="bg-gray-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-2">Page {currentPage}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(messages.length / complaintsPerPage)))}
                        className="bg-gray-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                        disabled={currentPage === Math.ceil(messages.length / complaintsPerPage)}
                    >
                        Next
                    </button>
                </div>
                {showWarning && (
                    <WarningPage message={warningMessage} onClose={hideWarning} />
                )}
            </div>
            <button
                onClick={() => navigate('/posting')}
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
                Create a Post
            </button>
        </div>
    );
}
    
export default HomePage;