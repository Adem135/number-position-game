import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Ensure this file contains the necessary styles

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateEmail = (email) => {
        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    };

    const validateUsername = (username) => {
        return /^[a-zA-Z0-9_]+$/.test(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(formData.email)) {
            setError('We only support @gmail.com emails.');
            return;
        }

        if (!validateUsername(formData.username)) {
            setError('Username can only contain A-Z, 0-9, and underscores.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
};

export default Signup;