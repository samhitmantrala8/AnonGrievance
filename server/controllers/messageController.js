import Message from '../models/Message.js';

// Post a new message
export const postMessage = async (req, res) => {
    try {
        const { username, description } = req.body;
        const media = req.file ? req.file.filename : '';

        if (!username || !description) {
            return res.status(400).json({ message: 'Username and description are required' });
        }

        const message = new Message({
            username,  // Storing the username only
            description,
            media
        });

        await message.save();
        res.json({ message: 'Message posted successfully' });
    } catch (error) {
        console.error('Error posting message:', error);
        res.status(500).json({ message: 'Failed to post message', error: error.message });
    }
};

// Get all messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().select('username description media upvotes downvotes comments createdAt').sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.remove();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
};

// Toggle upvote for a message
export const addUpvote = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        let message = await Message.findById(id);

        const hasUpvoted = message.upvotes.includes(username);

        if (hasUpvoted) {
            message.upvotes = message.upvotes.filter(user => user !== username);
        } else {
            const hasDownvoted = message.downvotes.includes(username);
            if (hasDownvoted) {
                message.downvotes = message.downvotes.filter(user => user !== username);
            }
            message.upvotes.push(username);
        }

        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ message: 'Failed to toggle upvote', error: error.message });
    }
};

// Toggle downvote for a message
export const addDownvote = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        let message = await Message.findById(id);

        const hasDownvoted = message.downvotes.includes(username);

        if (hasDownvoted) {
            message.downvotes = message.downvotes.filter(user => user !== username);
        } else {
            const hasUpvoted = message.upvotes.includes(username);
            if (hasUpvoted) {
                message.upvotes = message.upvotes.filter(user => user !== username);
            }
            message.downvotes.push(username);
        }

        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error toggling downvote:', error);
        res.status(500).json({ message: 'Failed to toggle downvote', error: error.message });
    }
};

// Add comment to a message
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, text } = req.body;
        const newComment = { username, text };
        const updatedMessage = await Message.findByIdAndUpdate(id, { $push: { comments: newComment } }, { new: true });
        res.json(updatedMessage);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment', error: error.message });
    }
};

// Fetch comments for a specific message
export const getCommentsByMessageId = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};

