import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-container">
            {/* Full-width Navigation Bar */}
            <nav className="navbar">
                <h1 className="logo">NUMBER<span className="logo-accent">POSITION</span></h1>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/how-to-play">How to Play</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                </ul>
            </nav>

            <main className="content">
                <h1 className="page-title">About Me</h1>

                <section className="about-section">
                    <h2>My Mission</h2>
                    <p>
                        My misson is to create a game that is fun and challenging, while also being a great way to exercise your mind. I want to create a game that is easy to understand, but hard to master. I want to create a game that is fun and addictive, while also being a great way to exercise your mind.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Game Overview</h2>
                    <p>
                        The "Number Position" game is a simple yet challenging puzzle game where you have to guess a secret code consisting of four unique digits. You have to figure out the correct numbers and their positions by making guesses, with feedback given after each guess. The goal is to guess the secret code in the fewest attempts possible.
                    </p>
                </section>

                <section className="about-section">
                    <h2>How the Game Works</h2>
                    <p>Two players compete against each other.</p>
                    <p>Each player has a secret code.</p>
                    <p>Players take turns guessing each other's secret code.</p>
                    <p>After each guess, feedback is provided on how many numbers are correct and how many are in the correct position.</p>
                    <p>The player who guesses the secret code first wins the game.</p>
                    <p>
                        For more details, check out our <Link to="/how-to-play">How to Play</Link> page.
                    </p>
                </section>

                <section className="about-section">
                    <h2>My Vision</h2>
                    <p>
                        I aim to build a strong community around this game where players can constantly challenge each other and improve their skills. With time, I hope to expand the game with additional features, new puzzles, and even more engaging modes. Stay tuned for future updates!
                    </p>
                </section>

                <section className="about-section">
                    <h2>Contact Me</h2>
                    <p>
                        Have questions or feedback? Check my <a href="https://github.com/Adem135" target="_blank" rel="noopener noreferrer">GitHub</a> for more projects or contact me directly using my<a href="mailto:kingnanfo@gmail.com"> Email</a>.
                    </p>
                </section>
            </main>

            <footer className="footer">
                <p className="copyright">
                    © {new Date().getFullYear()} Number Position Game. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default AboutPage;