// models/User.js
const mongoose = require('mongoose');

// Define the User schema with fields for username, wins, and losses
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures each username is unique
        trim: true    // Removes whitespace from both ends of the string
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        default: 0    // Default value for wins is 0
    },
    losses: {
        type: Number,
        default: 0    // Default value for losses is 0
    },
    draws: { type: Number, default: 0 }
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
