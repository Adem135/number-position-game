// src/components/HowToPlay.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HowToPlay.css';

import createGameImg from '../assets/create-game-screenshot.png';
import joinGameImg from '../assets/join-game-screenshot.png';
import gameplayImg from '../assets/gameplay-screenshot.png';
import leaderboardImg from '../assets/leaderboard-screenshot.png';
import secretSetupImg from '../assets/secretSetupImg.png';

const HowToPlay = () => {
    return (
        <div className="how-to-play-container">
            {/* Navigation Bar */}
            <nav className="nav-bar">
                <h1 className="logo">
                    NUMBER<span className="logo-accent">POSITION</span>
                </h1>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                    <Link to="/about">About</Link>
                </div>
            </nav>

            <main className="how-to-play-main">
                <h1 className="main-title">How to Play NUMBER POSITION</h1>

                <section className="guide-section">
                    {/* Step 01 - Getting Started */}
                    <div className="step-card">
                        <div className="step-content">
                            <div className="step-header">
                                <h2 className="step-number">01</h2>
                                <h3 className="step-title">Getting Started</h3>
                            </div>
                            <div className="step-instructions">
                                <div className="instruction-card">
                                    <h4 className="instruction-title">
                                        <span className="instruction-icon">✍️</span>
                                        Sign Up
                                    </h4>
                                    <div className="instruction-content">
                                        <p>Create your account using the signup form:</p>
                                        <ul className="styled-list">
                                            <li className="valid-rule">
                                                Unique username
                                                <span className="rule-detail"> - Choose a username that is not already taken by another user.</span>
                                            </li>
                                            <li className="valid-rule">
                                                Valid email address
                                                <span className="rule-detail"> - Ensure your email is correctly formatted and accessible for verification.</span>
                                            </li>
                                            <li className="valid-rule">
                                                Secure password
                                                <span className="rule-detail"> - Use a mix of letters, numbers, and symbols for better security.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="instruction-card">
                                    <h4 className="instruction-title">
                                        <span className="instruction-icon">🔑</span>
                                        Log In
                                    </h4>
                                    <div className="instruction-content">
                                        <p>Access your account using your credentials:</p>
                                        <ul className="styled-list">
                                            <li className="valid-rule">
                                                Registered email
                                                <span className="rule-detail"> - Use the email address you registered with to sign up.</span>
                                            </li>
                                            <li className="valid-rule">
                                                Account password
                                                <span className="rule-detail"> - Enter the password you set during registration. Ensure it is entered correctly, respecting case sensitivity.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 02 - Game Setup */}
                    <div className="step-card">
                        <div className="step-content">
                            <div className="step-header">
                                <h2 className="step-number">02</h2>
                                <h3 className="step-title">Game Setup</h3>
                            </div>
                            <div className="step-instructions">
                                <div className="instruction-card">
                                    <h4 className="instruction-title">
                                        <span className="instruction-icon">🆕</span>
                                        Create a Game
                                    </h4>
                                    <div className="instruction-content">
                                        <ol className="styled-list numbered">
                                            <li>Click "Create New Game"</li>
                                            <li>Wait for game ID generation</li>
                                            <li>Share ID with your opponent</li>
                                        </ol>
                                        <img src={createGameImg} alt="Create game interface" className="step-screenshot" />
                                    </div>
                                </div>

                                <div className="instruction-card">
                                    <h4 className="instruction-title">
                                        <span className="instruction-icon">🚪</span>
                                        Join a Game
                                    </h4>
                                    <div className="instruction-content">
                                        <ol className="styled-list numbered">
                                            <li>Click "Join Existing Game"</li>
                                            <li>Enter valid game ID</li>
                                            <li>Wait for host approval</li>
                                        </ol>
                                        <img src={joinGameImg} alt="Join game interface" className="step-screenshot" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 03 - Secret Number Setup */}
                    <div className="step-card">
                        <div className="step-content">
                            <div className="step-header">
                                <h2 className="step-number">03</h2>
                                <h3 className="step-title">Secret Number Setup</h3>
                            </div>
                            <div className="step-instructions">
                                <div className="instruction-card">
                                    <div className="rules-grid">
                                        <div className="rule-card requirement-card">
                                            <div className="rule-header">
                                                <div className="rule-icon">RULE</div>
                                                <h4>Creation Requirements</h4>
                                            </div>
                                            <ul className="styled-list checkmark-list">
                                                <li>Must be 4 digits (0-9)</li>
                                                <li>All digits must be unique</li>
                                            </ul>
                                        </div>

                                        <div className="rule-card example-card">
                                            <div className="rule-header">
                                                <div className="rule-icon">EXAMPLE</div>
                                                <h4>Valid/Invalid Numbers</h4>
                                            </div>
                                            <div className="number-examples">
                                                <div className="example-group">
                                                    <h5>Valid Numbers</h5>
                                                    <div className="number-display valid">
                                                        <span>1</span><span>2</span><span>3</span><span>4</span>
                                                    </div>
                                                    <div className="number-display valid">
                                                        <span>7</span><span>8</span><span>5</span><span>3</span>
                                                    </div>
                                                </div>
                                                <div className="example-group">
                                                    <h5>Invalid Numbers</h5>
                                                    <div className="number-display invalid">
                                                        <span>1</span><span>1</span><span>2</span><span>3</span>
                                                    </div>
                                                    <div className="number-display invalid">
                                                        <span>5</span><span>4</span><span>5</span><span>6</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <img src={secretSetupImg} alt="Secret setup interface" className="step-screenshot" />
                                    <div className="important-notice">
                                        <div className="notice-icon">!</div>
                                        <p>Your secret number remains hidden until game completion. Both players must set numbers before gameplay begins.</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 04 - Gameplay Mechanics */}
                    <div className="step-card">
                        <div className="step-content">
                            <div className="step-header">
                                <h2 className="step-number">04</h2>
                                <h3 className="step-title">Gameplay Mechanics</h3>
                            </div>
                            <div className="step-instructions">
                                <div className="instruction-card">
                                    <div className="gameplay-phase">
                                        <div className="phase-card">
                                            <h4 className="phase-title">Turn Structure</h4>
                                            <div className="phase-steps">
                                                <div className="phase-step">
                                                    <div className="phase-number">1</div>
                                                    <div className="phase-description">
                                                        Enter 4-digit guess following validation rules
                                                    </div>
                                                </div>
                                                <div className="phase-step">
                                                    <div className="phase-number">2</div>
                                                    <div className="phase-description">
                                                        Receive feedback:
                                                        <div className="feedback-key">
                                                            <span className="feedback-tag correct-digit">Numbers Correct - Number of digits that are correct</span>
                                                            <span className="feedback-tag correct-position">Positions Correct - Number of digits that are correct and in the correct position</span>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="phase-step">
                                                    <div className="phase-number">3</div>
                                                    <div className="phase-description">
                                                        Opponent's turn begins after feedback
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="gameplay-example">
                                            <h4 className="example-title">Sample Round</h4>
                                            <div className="guess-display">
                                                <div className="guess-digit">3 5 2 9</div>

                                            </div>
                                            <div className="feedback-display">
                                                <div className="feedback-result correct-digit">Numbers Correct: 2</div>
                                                <div className="feedback-result correct-position">Positions Correct: 1</div>
                                            </div>
                                            <p className="feedback-explanation">
                                                2 correct digits, and of the 2 digits, 1 of them is in the correct position
                                            </p>
                                        </div>
                                    </div>

                                    <img src={gameplayImg} alt="Gameplay interface" className="step-game-screenshot" />
                                    <div className="pro-tip">
                                        <p>
                                            <strong>💡Pro Strategy:</strong> Use feedback to eliminate impossible combinations
                                            and systematically narrow down possibilities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 05 - Leaderboards */}
                    <div className="step-card">
                        <div className="step-content">
                            <div className="step-header">
                                <h2 className="step-number">05</h2>
                                <h3 className="step-title">Leaderboards & Rankings</h3>
                            </div>
                            <div className="step-instructions">
                                <div className="instruction-card">
                                    <div className="leaderboard-info">

                                        <ul className="styled-list achievement-list">
                                            <li>Global ranking system based on wins, losses, and draws</li>
                                            <li>Performance statistics for each player</li>
                                            <li>Special achievement unlocks for top players</li>
                                        </ul>

                                    </div>
                                    <img src={leaderboardImg} alt="Leaderboard interface" className="step-screenshot" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="motivation-section">
                    <h3>Ready to Test Your Skills?</h3>
                    <p>
                        Challenge yourself and climb to the top of the leaderboard!
                        Every game counts towards your ranking. The more you play,
                        the higher you can climb!
                    </p>
                    <Link to="/" className="play-now-btn">Start Playing Now →</Link>
                </div>
            </main >


            <footer className="footer">
                <p className="copyright">
                    © {new Date().getFullYear()} Number Position Game. All rights reserved.
                </p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <span className="divider">|</span>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </footer>
        </div >
    );
};

export default HowToPlay; 