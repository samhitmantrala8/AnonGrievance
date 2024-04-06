import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
    postMessage,
    getMessages,
    deleteMessage,
    addUpvote,
    addDownvote,
    addComment,
    getCommentsByMessageId
} from '../controllers/messageController.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '../uploads/')); // Use join and __dirname here
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Post a new message
router.post('/post', upload.single('media'), postMessage);

// Get all messages
router.get('/all', getMessages);

// Delete a message by ID
router.delete('/:id', deleteMessage);

// Add upvote to a message
router.put('/upvote/:id', addUpvote);

// Add downvote to a message
router.put('/downvote/:id', addDownvote);

// Add comment to a message
router.put('/comment/:id', addComment);

router.get('/comments/:id', getCommentsByMessageId);

export default router;
