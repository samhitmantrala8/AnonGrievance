import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';  // Import CORS middleware
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';  // Import message routes

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8800;

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from this origin
    optionsSuccessStatus: 200
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);  // Use message routes
// Serve the uploads directory
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Server connection
app.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});
