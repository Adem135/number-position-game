import socketIOClient from "socket.io-client";

// Create a WebSocket connection to the backend
const socket = socketIOClient("http://localhost:3001"); // Adjust URL if necessary

// Send a guess to the backend
export function sendGuess(guess) {
    socket.emit('makeGuess', { guess });
}

// Listen for guess results from the backend
export function listenForGuessUpdates(callback) {
    socket.on('guessResult', (result) => {
        callback(result);
    });

    socket.on('error', (error) => {
        console.error(error.message);
    });
}
