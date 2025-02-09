import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/leaderboard', {
                params: { t: Date.now() },
                headers: { 'Cache-Control': 'no-cache' }
            });
            setLeaders(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="leaderboard-container">
            {/* Navigation Bar */}
            <nav className="nav-bar">
                <h1 className="logo">
                    NUMBER<span className="logo-accent">POSITION</span>
                </h1>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/how-to-play">How to Play</Link>
                    <Link to="/about">About</Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="leaderboard-main">
                <h2>Leaderboard</h2>
                <div className="champion-section">
                    {leaders.length > 0 && (
                        <>
                            <div className="crown-icon">👑</div>
                            <div className="champion-info">
                                <h3>Current Champion</h3>
                                <p className="champion-name">{leaders[0].username}</p>
                                <div className="champion-stats">
                                    <span>Wins: {leaders[0].wins}</span>
                                    <span>Losses: {leaders[0].losses}</span>
                                    <span>Draws: {leaders[0].draws}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="loading">Initializing Leaderboard</div>
                ) : (
                    <div className="leaderboard-content">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Wins</th>
                                    <th>Losses</th>
                                    <th>Draws</th>
                                    <th>Total Games</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.map((user, index) => {
                                    // Assign rank based on position
                                    let rankClass = '';
                                    if (index === 0) {
                                        rankClass = 'gold'; // 1st place
                                    } else if (index === 1) {
                                        rankClass = 'platinum'; // 2nd place
                                    } else if (index === 2) {
                                        rankClass = 'diamond'; // 3rd place
                                    }
                                    return (
                                        <tr key={user._id}>
                                            <td className={rankClass}>
                                                {index + 1}
                                                {index === 0 && <span className="top-player-badge"></span>}
                                            </td>
                                            <td>{user.username}</td>
                                            <td>{user.wins}</td>
                                            <td>{user.losses}</td>
                                            <td>{user.draws}</td>
                                            <td>{user.wins + user.losses + user.draws}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="motivation-section">
                            <h3>Want to be the Champion?</h3>
                            <p>
                                Challenge yourself and climb to the top of the leaderboard!
                                Every game counts towards your ranking. The more you play,
                                the higher you can climb!
                            </p>
                            <Link to="/create-game" className="play-now-btn">
                                Play Now
                            </Link>
                        </div>
                    </div>
                )}
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

export default Leaderboard;
