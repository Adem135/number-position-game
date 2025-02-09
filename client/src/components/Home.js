import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import githubIcon from '../assets/github.png';

const Home = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUser(null);
        navigate('/');
    };

    const handleCreate = () => {
        if (loggedIn) {
            navigate('/create-game', { state: { playerName: user?.username } });
        } else {
            alert("You need to log in first!");
        }
    };

    const handleJoin = () => {
        if (loggedIn) {
            navigate('/join-game', { state: { playerName: user?.username } });
        } else {
            alert("You need to log in first!");
        }
    };

    return (
        <div className="home-container">
            {/* Navigation Bar */}
            <nav className="nav-bar">
                <h1 className="logo">
                    NUMBER<span className="logo-accent">POSITION</span>
                </h1>
                <div className="nav-links">
                    <Link to="/how-to-play">How to Play</Link>
                    <Link to="/about">About</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                    <a
                        href="https://github.com/yourusername/number-position-game"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={githubIcon}
                            alt="GitHub Repository"
                            className="github-icon"
                        />
                    </a>
                    {loggedIn && (
                        <button onClick={handleLogout} className="btn logout-btn">
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="game-card">
                    <h2 className="title">Start Playing</h2>
                    {!loggedIn && (
                        <>
                            <p className="login-prompt">Log in or sign up to start playing!</p>
                            <div className="button-group auth-buttons">
                                <Link to="/signup">
                                    <button className="btn signup-btn">Sign Up</button>
                                </Link>
                                <Link to="/login">
                                    <button className="btn login-btn">Log In</button>
                                </Link>
                            </div>
                        </>
                    )}
                    {loggedIn && (
                        <>
                            <p className="welcome-msg">Welcome, {user?.username}!</p>
                            <div className="button-group game-buttons">
                                <button onClick={handleCreate} className="btn create-btn">
                                    Create New Game
                                </button>
                                <button onClick={handleJoin} className="btn join-btn">
                                    Join Existing Game
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p className="copyright">
                    © {new Date().getFullYear()} Number Position Game. All rights reserved.
                </p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
};

export default Home;