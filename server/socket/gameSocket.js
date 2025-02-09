module.exports = function (io) {
    // Listen for new connections to the socket
    io.on('connection', (socket) => {
        console.log('A player connected: ' + socket.id);

        // Listen for 'join-game' event to handle player joining
        socket.on('join-game', async (gameId) => {
            console.log(`Player joined game ${gameId}`);

            // Find the game in the database using the gameId
            const game = await Game.findOne({ gameId });
            if (!game) {
                // Emit an error if the game is not found
                socket.emit('game-error', 'Game not found');
                return;
            }

            // Check if the game already has two players
            if (game.player2Joined) {
                // Emit an error if the game already has two players
                socket.emit('game-error', 'Game already has two players');
                return;
            }

            // Mark the second player as joined and update the game status
            game.player2Joined = true;
            game.status = 'setSecret';  // Status after second player joins
            await game.save();

            // Emit the updated game state to all connected clients
            io.emit('game-updated', game);
        });

        // Handle disconnection of a player
        socket.on('disconnect', () => {
            console.log('A player disconnected: ' + socket.id);
        });
    });
};
