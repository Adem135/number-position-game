module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('A player connected: ' + socket.id);

        // Listen for 'join-game' event to handle player joining
        socket.on('join-game', async (gameId) => {
            console.log(`Player joined game ${gameId}`);

            const game = await Game.findOne({ gameId });
            if (!game) {
                socket.emit('game-error', 'Game not found');
                return;
            }

            if (game.player2Joined) {
                socket.emit('game-error', 'Game already has two players');
                return;
            }

            game.player2Joined = true;
            game.status = 'setSecret';  // Status after second player joins
            await game.save();

            io.emit('game-updated', game);  // Update all clients with the new game state
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A player disconnected: ' + socket.id);
        });
    });
};
