import express from 'express';

const app = express();
const PORT = process.env.PORT || 8800;

// MIDDLEWARES

// SERVER CONNECTION
app.listen(PORT, () => {
    console.log(`Server is running on PORT => ${PORT}`);
});