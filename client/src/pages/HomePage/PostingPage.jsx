import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HfInference } from "@huggingface/inference";
import Navbar from '../../components/Navbar/Navbar'; // Import Navbar
import WarningPage from './WarningPage'; // Import the warning page component

const HF_TOKEN = "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";
const inference = new HfInference(HF_TOKEN);

const PostPage = () => {
    const { username, isDarkMode } = useAuth(); // Assume isDarkMode is provided by the context
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState(null);
    const [error, setError] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    const postMessage = async () => {
        const userConfirmed = window.confirm("Are you sure you want to post this? Make sure that you do not post inappropriate content.");
        if (!userConfirmed) {
            return; 
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('description', description);
            if (media) {
                formData.append('media', media);
            }
            const pred = await inference.textClassification({
                model: 'samhitmantrala/hk111',
                inputs: description
            });

            pred.forEach((item) => {
                if ((item.label === 'POSITIVE' && item.score < 0.5)) {
                    handleWarning('Please post a positive message');
                    setDescription('');
                    return;
                } else if ((item.label === 'NEGATIVE' && item.score < 0.5)) {
                    axios.post('http://localhost:8800/api/messages/post', formData)
                        .then(() => {
                            setDescription('');
                            setMedia(null);
                            navigate('/'); 
                        })
                        .catch(err => {
                            setError('Error posting message: ' + err.message);
                        });
                }
            });
        } catch (error) {
            setError('Error posting message: ' + error.message);
        }
    };

    const handleWarning = (message) => {
        setWarningMessage(message);
        setShowWarning(true);
    };

    const hideWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <Navbar />
            <div className="flex flex-col justify-center items-center flex-grow p-4">
                <h2 className="text-2xl mb-4">Create a Post</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className={`shadow-md rounded-lg p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`border-2 rounded-md px-3 py-2 w-full mb-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                    <input
                        type="file"
                        onChange={(e) => setMedia(e.target.files[0])}
                        className="mb-4"
                    />
                    <button onClick={postMessage} className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                        Post
                    </button>
                    <p className="mt-4 text-sm text-gray-600">Note that your post will be automatically deleted after 72 hours.</p>
                </div>
                {showWarning && <WarningPage warningMessage={warningMessage} onClose={hideWarning} />}
            </div>
        </div>
    );
};

export default PostPage;
