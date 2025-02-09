import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Game = ({ gameId, player }) => {
    const [secretNumber, setSecretNumber] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await axios.get(`/api/games/${gameId}`);
                setGameData(response.data);
            } catch (err) {
                console.error('Error fetching game data:', err);
            }
        };
        fetchGameData();
    }, [gameId]);

    const handleSecretNumberChange = (e) => {
        setSecretNumber(e.target.value);
    };

    const handleGuessChange = (e) => {
        setGuess(e.target.value);
    };

    const handleSetSecretNumber = async () => {
        if (secretNumber.length !== 4 || new Set(secretNumber).size !== 4) {
            setMessage('Invalid secret number! Please ensure it has 4 unique digits.');
            return;
        }

        try {
            const response = await axios.post('/api/games/secret', { gameId, player, secretNumber });
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error setting secret number.');
        }
    };

    const handleSubmitGuess = async () => {
        if (guess.length !== 4 || new Set(guess).size !== 4) {
            setMessage('Invalid guess! Please enter 4 unique digits.');
            return;
        }

        try {
            const response = await axios.post('/api/games/guess', { gameId, player, guess });
            setGuesses([...guesses, { guess, n: response.data.n, p: response.data.p }]);
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error submitting guess.');
        }
    };

    const renderGuesses = () => {
        return guesses.map((g, index) => (
            <tr key={index}>
                <td>{g.guess}</td>
                <td>{g.n}</td>
                <td>{g.p}</td>
            </tr>
        ));
    };

    return (
        <div>
            <h1>Game ID: {gameId}</h1>
            {gameData && (
                <>
                    <h3>Your Secret Number: {gameData[player === 'player1' ? 'secretNumber1' : 'secretNumber2']}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Guess</th>
                                <th>N</th>
                                <th>P</th>
                            </tr>
                        </thead>
                        <tbody>{renderGuesses()}</tbody>
                    </table>

                    <div>
                        <input
                            type="text"
                            value={secretNumber}
                            onChange={handleSecretNumberChange}
                            maxLength="4"
                            placeholder="Set your secret number"
                        />
                        <button onClick={handleSetSecretNumber}>Set Secret Number</button>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={guess}
                            onChange={handleGuessChange}
                            maxLength="4"
                            placeholder="Enter your guess"
                        />
                        <button onClick={handleSubmitGuess}>Submit Guess</button>
                    </div>
                    <p>{message}</p>
                </>
            )}
        </div>
    );
};

export default Game;
