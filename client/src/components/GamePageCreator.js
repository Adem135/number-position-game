// src/components/GamePageCreator.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NumberHelper from './NumberHelper';
import { ReactComponent as ConfettiIcon } from '../assets/confetti.svg';
import './GamePageCreator.css';

const GamePageCreator = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState(null);
    const [guess, setGuess] = useState('');
    const [guessMessage, setGuessMessage] = useState('');
    const [turnTrigger, setTurnTrigger] = useState(null);
    const [gameEnded, setGameEnded] = useState(false);

    // Poll game data every 3 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/games/${gameId}`);
                setGameData(res.data);
                setTurnTrigger(res.data.turn); // update trigger when turn changes
            } catch (err) {
                console.error('Error fetching game data:', err);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [gameId]);

    if (!gameData) return <p>Loading game data...</p>;

    // For the creator, assume playerName is the first element.
    const playerName = gameData.players[0];
    const myGuesses = (gameData.guesses ?? []).filter(g => g.player === playerName);
    const oppGuesses = (gameData.guesses ?? []).filter(g => g.player === gameData.players[1]);
    const myTurn = gameData.turn === playerName;
    const finished = gameData.status === 'finished';

    const handleSubmitGuess = async (e) => {
        e.preventDefault();
        if (!guess) {
            alert('Please enter a guess.');
            return;
        }
        if (guess.length !== 4 || new Set(guess).size !== 4) {
            setGuessMessage('Please enter exactly 4 unique digits.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/games/guess', { gameId, player: playerName, guess });
            setGuessMessage(res.data.message);
            setGuess('');
        } catch (err) {
            console.error('Error submitting guess:', err);
            setGuessMessage(err.response?.data?.message || 'Error submitting guess');
        }
    };

    // Quit Game: call the quitGame endpoint to end the game
    const handleQuitGame = async () => {
        const confirmation = window.confirm('Are you sure you want to end the game? You will be counted as the loser.');
        if (confirmation) {
            try {
                await axios.post('http://localhost:5000/api/games/quitGame', { gameId, player: playerName });
                setGameEnded(true);
            } catch (err) {
                console.error('Error ending the game:', err);
            }
        }
    };

    let outcomeMessage = '';
    if (finished) {
        if (gameData.winner === "draw") {
            outcomeMessage = "It's a draw!";
        } else if (gameData.winner === playerName) {
            outcomeMessage = "Congratulations! You win! Confetti!!!";
        } else {
            outcomeMessage = "You lost! Better luck next time!";
        }
    }

    const handleResetGame = async () => {
        try {
            await axios.post('http://localhost:5000/api/games/reset', { gameId });
            navigate('/');
        } catch (err) {
            console.error('Error resetting game:', err);
        }
    };

    return (
        <div className="game-container creator-view">
            <nav className="nav-bar">
                <h1 className="logo">
                    NUMBER<span className="logo-accent">POSITION</span>
                </h1>
                {!finished && (
                    <button onClick={handleQuitGame} className="btn quit-game-btn">
                        Quit Game
                    </button>
                )}
            </nav>

            <main className="game-main">
                <div className="game-header">
                    <h2 className="game-title">
                        Game Room: <span className="code">{gameId}</span>
                    </h2>
                    <div className="status-badge">
                        {finished ? 'Game Over' : myTurn ? 'Your Turn' : "Opponent's Turn"}
                    </div>
                </div>

                <div className="secret-code-display">
                    Your Secret Code: <span className="code">{gameData.secretCode1}</span>
                </div>

                {finished && (
                    <>
                        <div className="outcome-banner">
                            {gameData.winner === "draw" ? (
                                <><span>🤝</span> {outcomeMessage}</>
                            ) : gameData.winner === playerName ? (
                                <><ConfettiIcon className="confetti" /> {outcomeMessage}</>
                            ) : (
                                <><span>💔</span> {outcomeMessage}</>
                            )}
                            <button className="btn home-btn" onClick={() => navigate('/')}>
                                Return to Home
                            </button>
                        </div>
                        {/* Reveal both secret codes once the game is finished */}
                        <div className="secret-code-reveal">
                            <h3>Secret Codes Revealed</h3>
                            <p>
                                {gameData.players[0]}'s Secret Code: <span className="code">{gameData.secretCode1}</span>
                            </p>
                            <p>
                                {gameData.players[1]}'s Secret Code: <span className="code">{gameData.secretCode2}</span>
                            </p>
                        </div>
                    </>
                )}

                {!finished && !gameEnded && (
                    <>
                        <div className="guess-history-container">
                            <div className="guess-column">
                                <h3 className="column-title">Your Guesses</h3>
                                <div className="guess-table">
                                    <div className="table-header">
                                        <div>Guess</div>
                                        <div>Numbers Correct</div>
                                        <div>Positions Correct</div>
                                    </div>
                                    {myGuesses.length === 0 ? (
                                        <div className="empty-state">No guesses yet</div>
                                    ) : (
                                        myGuesses.map((g, index) => (
                                            <div className="table-row" key={index}>
                                                <div>{g.guess}</div>
                                                <div className="correct-count">{g.numbersCorrect}</div>
                                                <div className="correct-count">{g.positionsCorrect}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="guess-column">
                                <h3 className="column-title">Opponent's Guesses</h3>
                                <div className="guess-table">
                                    <div className="table-header">
                                        <div>Guess</div>
                                        <div>Numbers Correct</div>
                                        <div>Positions Correct</div>
                                    </div>
                                    {oppGuesses.length === 0 ? (
                                        <div className="empty-state">No guesses yet</div>
                                    ) : (
                                        oppGuesses.map((g, index) => (
                                            <div className="table-row" key={index}>
                                                <div>{g.guess}</div>
                                                <div className="correct-count">{g.numbersCorrect}</div>
                                                <div className="correct-count">{g.positionsCorrect}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="guess-input-section">
                            {myTurn ? (
                                <form className="guess-form" onSubmit={handleSubmitGuess}>
                                    <input
                                        type="text"
                                        className="guess-input"
                                        placeholder="Enter your guess"
                                        value={guess}
                                        onChange={(e) => setGuess(e.target.value)}
                                        maxLength="4"
                                        pattern="\d{4}"
                                    />
                                    <button
                                        type="submit"
                                        className="btn submit-guess-btn"
                                        disabled={!guess || guess.length !== 4 || new Set(guess).size !== 4}
                                    >
                                        Submit Guess
                                    </button>
                                </form>
                            ) : (
                                <p className="waiting-turn">
                                    <span className="pulse-dot"></span>
                                    Waiting for your turn...
                                </p>
                            )}
                            <NumberHelper />
                            {guessMessage && <div className="guess-feedback">{guessMessage}</div>}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default GamePageCreator;
