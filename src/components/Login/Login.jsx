import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './login.css';
import Nav from '../navtop';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);

    try {
      const response = await axios.post('http://localhost:3001/api/v1/users/login', formData);
      console.log('User logged in successfully:', response.data);

      const { token, role } = response.data;
      localStorage.setItem('token', token);

      // Conditional redirection based on role
      if (role === 'Admin') {
        navigate('/adminDashboard');
      } else if (role === 'Employee' || role === 'Manager') {
        navigate('/employeeManagerDashboard');
      } else {
        throw new Error('Invalid role');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setShowError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="loginsignup">
      <Nav option1="Home" link1="/" option2="Home" link2="/" />
      <div className="loginparent">
        <div className="left">
          <div className="welcomgrp">
            <h3>Welcome to Login</h3>
          </div>
        </div>
        <div className="right">
          <h3>Login</h3>
          <form className="inputs" onSubmit={handleSubmit}>
            {/* Error Snackbar */}
            <Snackbar
              open={showError}
              autoHideDuration={1000}
              onClose={() => setShowError(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar
              open={Boolean(successMessage)}
              autoHideDuration={1000}
              onClose={() => setSuccessMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
                {successMessage}
              </Alert>
            </Snackbar>

            {/* User ID Input */}
            <TextField
              className="signupinput"
              margin="normal"
              fullWidth
              name="user_id"
              label="User ID"
              type="text"
              value={formData.user_id}
              onChange={handleChange}
              required
            />

            {/* Password Input */}
            <TextField
              className="signupinput"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#016375', borderRadius: '15px' }}
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
