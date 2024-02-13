// src/components/Register.js
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // New state for button status

  const nav = useNavigate();

  const handleRegister = async () => {
    if (isRegistering) {
      return; // Prevent multiple clicks while the registration is in progress
    }

    try {
      setIsRegistering(true); // Disable the button

      const response = await axios.post('https://chatappserver-zop9.onrender.com/register', {
        email,
        password,
        nickname,
        mobileNumber,
      });

      alert(response.data.message || response.data.error);

      // Assuming your backend returns a success message or user data, you can redirect after successful registration
      nav('/login');
    } catch (error) {
      console.error('Error registering user:', error.message);
    } finally {
      // Enable the button after a delay (e.g., 3 seconds)
      setTimeout(() => {
        setIsRegistering(false);
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nickname" className="form-label">Nickname:</label>
          <input
            type="text"
            className="form-control"
            id="nickname"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">Mobile Number:</label>
          <input
            type="tel"
            className="form-control"
            id="mobileNumber"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleRegister}>
          Register
        </button>
        <div className="mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
