import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8060/api/users/validate/user', {
                userEmail: email,
                userPassword: password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('roles', JSON.stringify(response.data.allRoles));

            if (response.data.allRoles.includes('ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <button onClick={toggleDarkMode} className="theme-toggle">
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            
            <div className="container">
                <div className="login-wrapper">
                    {/* Left side */}
                    <div className="welcome-side">
                        <div className="welcome-content">
                            <h1>Welcome Back!</h1>
                            <p>Please login to access your account</p>
                        </div>
                    </div>

                    {/* Right side - Login Form */}
                    <div className="login-side">
                        <div className="login-content">
                            <h2>Login</h2>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Password</label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter your password"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={togglePasswordVisibility}
                                            className="visibility-toggle"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="login-button">
                                    Login
                                </button>

                                <button type="button" className="forgot-password">
                                    Forgot Password?
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;