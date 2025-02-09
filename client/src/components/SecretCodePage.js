// src/components/SecretCodePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SecretCodePage.css';
import { ReactComponent as LoadingSpinner } from '../assets/loading-spinner.svg';

const SecretCodePage = () => {
    const { playerName, gameId } = useParams();
    const navigate = useNavigate();
    const [secretCode, setSecretCode] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeSubmitted, setCodeSubmitted] = useState(false);
    const [waitingForPlayer, setWaitingForPlayer] = useState('');

    const handleSetSecretCode = async () => {
        setMessage(''); // Clear previous messages

        // Validation checks
        if (secretCode.length !== 4) {
            setMessage('Secret code must be exactly 4 digits.');
            return;
        }

        if (new Set(secretCode).size !== 4) {
            setMessage('Error: Cannot repeat a number');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/games/setsecret', {
                gameId,
                playerName,
                secretCode
            });

            setMessage(response.data.message);
            const game = response.data.game;
            setCodeSubmitted(true);

            // Determine who we're waiting for
            const otherPlayer = game.players.find(p => p !== playerName);
            setWaitingForPlayer(`Waiting for ${otherPlayer}...`);

        } catch (err) {
            console.error('Error setting secret code:', err);
            setMessage('Error setting secret code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputNavigation = (e, index) => {
        if (codeSubmitted) return; // Disable input after submission

        const inputs = document.querySelectorAll('.digit-input');

        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < 3) inputs[index + 1].focus();
        }

        // Handle Backspace
        if (e.key === 'Backspace' && !secretCode[index] && index > 0) {
            inputs[index - 1].focus();
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/games/${gameId}`);
                const game = res.data;
                if (game.status === 'in-progress') {
                    navigate(`/game/${game.players[0] === playerName ? 'c' : 'j'}/${gameId}`);
                }
            } catch (err) {
                console.error('Error polling game status:', err);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [gameId, playerName, navigate]);

    return (
        <div className="secret-code-container">
            <nav className="nav-bar">
                <h1 className="logo">NUMBER<span className="logo-accent">POSITION</span></h1>
            </nav>

            <main className="main-content">
                <div className="game-card">
                    <div className="secret-code-panel">
                        <h2>{codeSubmitted ? 'Secret Code Set' : 'Set Your Secret Code'}</h2>

                        <div className="player-info">
                            <span className="info-label">Player:</span>
                            <span className="info-value">{playerName}</span>
                        </div>

                        <div className="player-info">
                            <span className="info-label">Game Code:</span>
                            <span className="info-value code">{gameId}</span>
                        </div>

                        <div className="code-input-group">
                            <div className="digit-inputs">
                                {[0, 1, 2, 3].map((index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        className="digit-input"
                                        maxLength="1"
                                        value={secretCode[index] || ''}
                                        onChange={(e) => {
                                            if (codeSubmitted) return;
                                            const newCode = [...secretCode];
                                            const value = e.target.value.replace(/\D/g, '').slice(-1);
                                            newCode[index] = value;
                                            setSecretCode(newCode.join(''));

                                            // Auto-focus next input when number entered
                                            if (value && index < 3) {
                                                document.querySelectorAll('.digit-input')[index + 1].focus();
                                            }
                                        }}
                                        onKeyDown={(e) => handleInputNavigation(e, index)}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        autoFocus={index === 0 && !codeSubmitted}
                                        readOnly={codeSubmitted}
                                        style={{
                                            borderColor: codeSubmitted ? '#00f3ff55' : '#00f3ff',
                                            cursor: codeSubmitted ? 'default' : 'text'
                                        }}
                                    />
                                ))}
                            </div>
                            {!codeSubmitted && (
                                <small className="hint-text">Enter 4 unique digits (0-9)</small>
                            )}
                        </div>

                        {!codeSubmitted && (
                            <button
                                className="btn submit-btn"
                                onClick={handleSetSecretCode}
                                disabled={isSubmitting || secretCode.length !== 4 || new Set(secretCode).size !== 4}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner className="spinner" />
                                        Setting Code...
                                    </>
                                ) : 'Lock In Secret Code'}
                            </button>
                        )}

                        {message && (
                            <div className={`alert ${message.includes('Error') ? 'error' : 'info'}`}>
                                {message}
                            </div>
                        )}

                        <div className="status-indicator">
                            <LoadingSpinner className="spinner" />
                            <span>
                                {codeSubmitted
                                    ? waitingForPlayer
                                    : 'Waiting for other player...'}
                            </span>
                        </div>
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

export default SecretCodePage;