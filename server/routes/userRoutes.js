// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// This endpoint returns users sorted by wins (you can adjust the sorting logic as needed)
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({}).sort({ wins: -1, losses: 1 }).limit(20);
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;
