import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Logout Route
router.get('/logout', logoutUser);

export default router;
