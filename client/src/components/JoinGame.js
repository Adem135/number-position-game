// src/components/JoinGame.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JoinGame.css';

const JoinGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [playerName, setPlayerName] = useState(location.state?.playerName || '');
    const [gameId, setGameId] = useState('');
    const [message, setMessage] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        if (!playerName) {
            navigate('/');
        }
    }, [playerName, navigate]);

    const handleJoinGame = async () => {
        if (!gameId) {
            alert('Please enter the game code');
            return;
        }
        setIsJoining(true);
        try {
            const response = await axios.post('http://localhost:5000/api/games/join', { gameId, playerName });
            const game = response.data.game;
            setMessage(response.data.message);
            if (game.players.length === 2 && game.status === 'waitingForSecret') {
                navigate(`/${playerName}/setsecretcode/${gameId}`);
            }
        } catch (err) {
            console.error('Error joining game:', err);
            setMessage('Error joining game. Please check the game code.');
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="join-game-container">
            <nav className="nav-bar">
                <h1 className="logo">NUMBER<span className="logo-accent">POSITION</span></h1>
            </nav>

            <main className="main-content">
                <div className="game-card">
                    <div className="join-panel">
                        <h2>Join Existing Game</h2>
                        <div className="player-info">
                            <span className="player-label">Player Name:</span>
                            <span className="player-name">{playerName}</span>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Game Code"
                                value={gameId}
                                onChange={(e) => setGameId(e.target.value)}
                                className="code-input"
                            />
                        </div>

                        <button
                            className="btn join-btn"
                            onClick={handleJoinGame}
                            disabled={isJoining}
                        >
                            {isJoining ? 'Joining...' : 'Join Game'}
                        </button>

                        {message && (
                            <div className={`alert ${message.includes('Error') ? 'error' : 'info'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p className="copyright">
                    © {new Date().getFullYear()} Number Position Game. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default JoinGame;