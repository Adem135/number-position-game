// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_here'; // Change this to an environment variable in production

// Signup function
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Basic validations
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with that email or username already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        // Create JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: { username: newUser.username, email: newUser.email }
        });
    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic validations
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signup,
    login
};
