// src/components/NumberHelper.js
import React, { useState } from 'react';
import './NumberHelper.css';

const NumberHelper = () => {
    const initialState = Array(10).fill(false);
    const [eliminated, setEliminated] = useState(initialState);

    const toggleDigit = (digit) => {
        const newState = [...eliminated];
        newState[digit] = !newState[digit];
        setEliminated(newState);
    };

    return (
        <div className="number-helper-container">
            <h3 className="helper-title">Number Eliminator</h3>
            <p className="helper-subtitle">Cross out numbers not in the secret code:</p>
            <div className="number-grid">
                {Array.from({ length: 10 }, (_, i) => (
                    <button
                        key={i}
                        className={`number-btn ${eliminated[i] ? 'eliminated' : ''}`}
                        onClick={() => toggleDigit(i)}
                    >
                        <span className="digit">{i}</span>
                        {eliminated[i] && <div className="elimination-effect" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NumberHelper;