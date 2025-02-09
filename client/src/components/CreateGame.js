// src/components/CreateGame.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './CreateGame.css';
import { ReactComponent as LoadingSpinner } from '../assets/loading-spinner.svg';


const CreateGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [playerName, setPlayerName] = useState(location.state?.playerName || '');
    const [gameId, setGameId] = useState('');
    const [message, setMessage] = useState('');
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        if (!playerName) {
            navigate('/');
        }
    }, [playerName, navigate]);

    const handleCreateGame = async () => {
        setIsCreating(true);
        try {
            const response = await axios.post('http://localhost:5000/api/games', { playerName });
            setGameId(response.data.gameId);
            setMessage(response.data.message);
        } catch (err) {
            console.error('Error creating game:', err);
            setMessage('Error creating game. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const nextQuestion = () => {
        const nextIndex = (currentQuestion + 1) % questions.length;
        setCurrentQuestion(nextIndex);
    };

    return (
        <div className="create-game-container">
            <nav className="nav-bar">
                <h1 className="logo">NUMBER<span className="logo-accent">POSITION</span></h1>
            </nav>

            <main className="main-content">
                <div className="game-card">
                    {!gameId ? (
                        <div className="creation-panel">
                            <h2>Create New Game</h2>
                            <div className="player-info">
                                <span className="player-label">Player Name:</span>
                                <span className="player-name">{playerName}</span>
                            </div>
                            <button
                                className="btn create-btn"
                                onClick={handleCreateGame}
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <LoadingSpinner className="spinner" />
                                ) : (
                                    'Generate Game Code'
                                )}
                            </button>
                            {message && <div className="alert error">{message}</div>}
                        </div>
                    ) : (
                        <div className="waiting-panel">
                            <h2>Game Created!</h2>
                            <div className="game-id-display">
                                <span className="label">Game Code:</span>
                                <span className="code">{gameId}</span>
                            </div>
                            <p className="instructions">
                                Share this code with Player 2 to start the game.
                            </p>
                            <div className="status-indicator">
                                <LoadingSpinner className="spinner" />
                                <span>Waiting for player 2 to join...</span>
                            </div>
                            {message && <div className="alert info">{message}</div>}

                        </div>
                    )}
                </div>


            </main>

            <footer className="footer">
                <p className="copyright">
                    © {new Date().getFullYear()} Number Position Game. All rights reserved.
                </p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
                <PlayerJoinPoll gameId={gameId} playerName={playerName} navigate={navigate} />
            </footer>
        </div>
    );
};

const PlayerJoinPoll = ({ gameId, playerName, navigate }) => {
    useEffect(() => {
        if (!gameId) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/games/${gameId}`);
                const game = response.data;
                if (game.players.length === 2 && game.status === 'waitingForSecret') {
                    navigate(`/${playerName}/setsecretcode/${gameId}`);
                }
            } catch (err) {
                console.error('Error polling game status:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [gameId, playerName, navigate]);

    return null;
};

export default CreateGame;
