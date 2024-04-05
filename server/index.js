import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes.js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8800;

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Server connection
app.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});
