const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameId: { type: String, required: true, unique: true },
    players: { type: [String], default: [] },
    status: { type: String, enum: ['waiting', 'waitingForSecret', 'in-progress', 'finished'], default: 'waiting' },
    secretCode1: { type: String },
    secretCode2: { type: String },
    turn: { type: String },
    winner: { type: String },
    loser: { type: String },
    guesses: { type: Array, default: [] },
    perfect1: { type: Boolean, default: false },
    perfect2: { type: Boolean, default: false },
    leaderboardUpdated: { type: Boolean, default: false }
});




module.exports = mongoose.model('Game', gameSchema);
