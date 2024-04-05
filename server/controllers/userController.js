import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

// Encrypt data
const encryptData = (data) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, key: key.toString('hex'), iv: iv.toString('hex') };
};

// Decrypt data
const decryptData = (encryptedData, key, iv) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const generateUsername = (email) => {
    const crimeRelatedNames = ['CrimeBuster', 'Saviour', 'Vigilante', 'HeroicGuard', 'ShieldBearer'];
    const randomName = crimeRelatedNames[Math.floor(Math.random() * crimeRelatedNames.length)];
    const randomString = Math.random().toString(36).substring(7);
    return `${randomName}_${randomString}`;
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Encrypt entered email and password
        const { encryptedData: encryptedEmail, key: emailKey, iv: emailIv } = encryptData(email);
        const { encryptedData: encryptedPassword, key: passwordKey, iv: passwordIv } = encryptData(password);

        // Generate unique username
        const username = generateUsername(email);

        // Create a new user
        const newUser = new User({
            username,
            email: encryptedEmail,
            password: encryptedPassword,
            emailKey,
            emailIv,
            passwordKey,
            passwordIv,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find all users
        const users = await User.find();

        // Find the user by email
        const user = users.find(user => {
            const decryptedEmail = decryptData(user.email, user.emailKey, user.emailIv);
            return decryptedEmail === email;
        });

        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Decrypt stored password
        const decryptedPassword = decryptData(user.password, user.passwordKey, user.passwordIv);

        // Check if the decrypted password matches the entered password
        if (decryptedPassword !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        // Store token in local storage
        // localStorage.setItem('token', token);

        res.status(200).json({ message: 'User logged in successfully', username: user.username, token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login user', error: error.message });
    }
};

// Logout User
export const logoutUser = async (req, res) => {
    try {
        // Remove token from local storage
        localStorage.removeItem('token');

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to logout user', error: error.message });
    }
};
