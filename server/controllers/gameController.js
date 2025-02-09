// Import the Game model for accessing game data
const Game = require('../models/Game');

// Import the PlayerStat model for accessing user statistics
const PlayerStat = require('../models/User');

// Utility function to generate a random 6-character game ID
const generateGameId = () => {
    return Math.random().toString(36).substring(2, 8);
};

// Validate that the secret code is exactly 4 digits and all digits are unique
const isValidSecretCode = (code) => {
    if (!/^\d{4}$/.test(code)) return false;
    const digits = new Set(code);
    return digits.size === 4;
};

// Helper function to calculate numbers correct and positions correct
const calculateNumbersAndPositions = (secret, guess) => {
    let numbersCorrect = 0;
    let positionsCorrect = 0;
    const secretDigits = secret.split('');
    const guessDigits = guess.split('');
    guessDigits.forEach((digit, i) => {
        if (secretDigits.includes(digit)) {
            numbersCorrect++;
        }
        if (secretDigits[i] === digit) {
            positionsCorrect++;
        }
    });
    return { numbersCorrect, positionsCorrect };
};

// Helper function to update leaderboard stats (wins, losses, draws) for both players
const updateLeaderboard = async (game) => {
    console.log(`Updating leaderboard for game ${game.gameId}...`);
    if (game.leaderboardUpdated) {
        console.log('Leaderboard already updated for this game.');
        return;
    }
    try {
        if (game.winner === 'draw') {
            console.log(`Updating draw for both players: ${game.players[0]}, ${game.players[1]}`);
            await PlayerStat.updateOne({ username: game.players[0] }, { $inc: { draws: 1 } });
            await PlayerStat.updateOne({ username: game.players[1] }, { $inc: { draws: 1 } });
        } else {
            console.log(`Updating win for ${game.winner} and loss for ${game.loser}`);
            await PlayerStat.updateOne({ username: game.winner }, { $inc: { wins: 1 } });
            await PlayerStat.updateOne({ username: game.loser }, { $inc: { losses: 1 } });
        }
        game.leaderboardUpdated = true;
        await game.save();
        console.log(`Leaderboard update complete for game ${game.gameId}.`);
    } catch (err) {
        console.error('Error updating leaderboard:', err);
    }
};

// Create a new game (Player 1)
const startGame = async (req, res) => {
    try {
        const { playerName } = req.body;
        if (!playerName) {
            return res.status(400).json({ message: 'Player name is required' });
        }
        const gameId = generateGameId();
        const newGame = new Game({
            gameId,
            players: [playerName],
            status: 'waiting'
        });
        await newGame.save();
        return res.status(201).json({ gameId, message: 'Game created. Waiting for Player 2 to join.' });
    } catch (err) {
        console.error('Error creating game:', err);
        return res.status(500).json({ message: 'Error creating game' });
    }
};

// Join an existing game (Player 2)
const joinGame = async (req, res) => {
    try {
        const { gameId, playerName } = req.body;
        if (!gameId || !playerName) {
            return res.status(400).json({ message: 'Game ID and Player name are required' });
        }

        const game = await Game.findOne({ gameId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (game.players.length >= 2) {
            return res.status(400).json({ message: 'Game already has two players' });
        }

        game.players.push(playerName);
        game.status = 'waitingForSecret';

        // If both players are now in the game, set the start time
        if (game.players.length === 2) {
            game.startTime = new Date();  // Store the current timestamp
        }

        await game.save();
        return res.status(200).json({ game, message: 'Player 2 joined successfully. Proceed to set your secret code.' });
    } catch (err) {
        console.error('Error joining game:', err);
        return res.status(500).json({ message: 'Error joining game' });
    }
};

// Calculate the elapsed time since the game started
const getElapsedTime = async (gameId) => {
    const game = await Game.findOne({ gameId });
    if (!game || !game.startTime) return 0;

    const now = new Date();
    const elapsedTime = Math.floor((now - game.startTime) / 1000); // in seconds
    return elapsedTime;
};

// Set the secret code for a player
// When both secret codes are set, update status to in-progress and set turn to the creator
const setSecretCode = async (req, res) => {
    try {
        const { gameId, playerName, secretCode } = req.body;
        if (!gameId || !playerName || !secretCode) {
            return res.status(400).json({ message: 'Game ID, player name, and secret code are required' });
        }
        if (!isValidSecretCode(secretCode)) {
            return res.status(400).json({ message: 'Invalid secret code. Must be 4 unique digits.' });
        }
        const game = await Game.findOne({ gameId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (!game.players.includes(playerName)) {
            return res.status(400).json({ message: 'Player not part of this game' });
        }
        if (game.players[0] === playerName) {
            if (game.secretCode1) {
                return res.status(400).json({ message: 'Secret code already set for Player 1' });
            }
            game.secretCode1 = secretCode;
        } else if (game.players[1] === playerName) {
            if (game.secretCode2) {
                return res.status(400).json({ message: 'Secret code already set for Player 2' });
            }
            game.secretCode2 = secretCode;
        }
        // When both secret codes are set, update status to in-progress and set turn to creator
        if (game.secretCode1 && game.secretCode2) {
            game.status = 'in-progress';
            game.turn = game.players[0]; // creator starts first
        }
        const updatedGame = await game.save();
        return res.status(200).json({ game: updatedGame, message: 'Secret code set successfully.' });
    } catch (err) {
        console.error('Error setting secret code:', err);
        return res.status(500).json({ message: 'Error setting secret code' });
    }
};

// Submit a guess by a player (only allowed if it is that player's turn)
// New guesses are added on top. Also, we check for perfect guesses and determine the game outcome
const submitGuess = async (req, res) => {
    try {
        const { gameId, player, guess } = req.body;
        if (!gameId || !player || !guess) {
            return res.status(400).json({ message: 'gameId, player and guess are required' });
        }
        const game = await Game.findOne({ gameId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        if (game.status === "finished") {
            await updateLeaderboard(game);
            return res.status(400).json({ message: "Game already finished." });
        }
        // Enforce turn-based guessing
        if (game.turn !== player) {
            return res.status(400).json({ message: "It's not your turn." });
        }
        // Determine opponent secret code
        let opponentSecret;
        if (game.players[0] === player) {
            opponentSecret = game.secretCode2;
        } else if (game.players[1] === player) {
            opponentSecret = game.secretCode1;
        } else {
            return res.status(400).json({ message: 'Player not part of this game' });
        }
        if (!opponentSecret) {
            return res.status(400).json({ message: 'Opponent secret code not set yet' });
        }
        const result = calculateNumbersAndPositions(opponentSecret, guess);
        // Add the new guess on top of the guesses array
        game.guesses.unshift({
            player,
            guess,
            numbersCorrect: result.numbersCorrect,
            positionsCorrect: result.positionsCorrect
        });

        // Check for a perfect guess (4 correct digits and 4 in the correct position)
        const perfect = (result.numbersCorrect === 4 && result.positionsCorrect === 4);

        if (perfect) {
            if (player === game.players[0]) { // Player 1 (creator)
                game.perfect1 = true;
                // Allow Player 2 one more turn by switching turn
                game.turn = game.players[1];
            } else { // Player 2 (joiner)
                game.perfect2 = true;
                // Decide outcome: if Player 1 had a perfect guess, it's a draw; otherwise, Player 2 wins
                if (game.perfect1) {
                    game.winner = "draw";
                } else {
                    game.winner = game.players[1];
                }
                game.status = "finished";
                game.loser = game.players[0] === game.winner ? game.players[1] : game.players[0];
            }
        } else {
            // If it is Player 2's turn and Player 1 had already made a perfect guess,
            // then if Player 2 does not get a perfect guess, Player 1 wins
            if (player === game.players[1] && game.perfect1) {
                game.winner = game.players[0];
                game.loser = game.players[1];
                game.status = "finished";
            } else {
                // Otherwise, update turn normally
                if (game.turn === game.players[0]) {
                    game.turn = game.players[1];
                } else {
                    game.turn = game.players[0];
                }
            }
        }

        await game.save();

        // If the game has finished, update the leaderboard stats
        if (game.status === "finished") {
            await updateLeaderboard(game);
        }

        return res.status(200).json({ message: 'Guess submitted successfully!', ...result });
    } catch (err) {
        console.error('Error submitting guess:', err);
        return res.status(500).json({ message: 'Error submitting guess' });
    }
};

// Endpoint to mark the game as ended when a player quits (endGame)
const endGame = async (req, res) => {
    const { gameId, winner, loser } = req.body;

    try {
        // Use findOne with the custom gameId field instead of findById
        const game = await Game.findOne({ gameId: gameId });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Ensure the game is in progress before ending
        if (game.status === 'finished') {
            return res.status(400).json({ message: 'Game has already ended' });
        }

        // Update the game to "finished" status
        game.status = 'finished';
        game.winner = winner;
        game.loser = loser;

        await game.save();

        // Update leaderboard stats if not already updated
        await updateLeaderboard(game);

        return res.status(200).json({ message: 'Game ended successfully', winner, loser });
    } catch (err) {
        console.error('Error ending game:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Endpoint to update the game status when a player quits (quitGame)
const quitGame = async (req, res) => {
    const { gameId, player } = req.body;

    try {
        const game = await Game.findOne({ gameId: gameId });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Ensure the game is still in progress
        if (game.status === 'finished') {
            return res.status(400).json({ message: 'Game has already ended' });
        }

        // Mark the game as ended
        game.status = 'finished';

        // Determine the winner (opponent of the player who quit)
        const opponent = game.players[0] === player ? game.players[1] : game.players[0];
        game.winner = opponent;
        game.loser = player;

        await game.save();

        // Update leaderboard stats if not already updated
        await updateLeaderboard(game);

        return res.status(200).json({ message: `${player} ended the game. ${opponent} is the winner.` });
    } catch (err) {
        console.error('Error quitting game:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get game data by gameId
const getGameData = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = await Game.findOne({ gameId });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        return res.status(200).json(game);
    } catch (err) {
        console.error('Error fetching game data:', err);
        return res.status(500).json({ message: 'Error fetching game data' });
    }
};

// Export the controller functions for use in routes
module.exports = {
    startGame,
    joinGame,
    setSecretCode,
    submitGuess,
    getGameData,
    endGame,
    quitGame
};