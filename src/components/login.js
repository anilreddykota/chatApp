// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { Link, useNavigate } from 'react-router-dom';

const Login = ({userId}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();


  const handleLogin = async () => {
    try {
      // Make an API request to your backend route for user login
      const response = await axios.post('https://chatappserver-zop9.onrender.com/login', { email, password });

      // Handle the response as needed
      if(response.data.message==="success"){
        localStorage.setItem('token',response.data.userRecord);
        userId(response.data.userRecord)
        nav('/');
        window.location.reload();
        // Assuming your backend returns a success message or user data, you can redirect after successful login
       
      }else{
        alert(response.data.message || response.data.message);
      }
     
    } catch (error) {
      console.error('Error logging in:', error.message);
    }finally{
    
    }
  };

  return (
    <div className="container mt-5">
            <div className="text-center h1 bg-color-2 text-light">I CHAT WITH YOU</div>

    <h2>Login</h2>
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
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleLogin} disabled={email?.length <9 || password?.length <4}>
        Login
      </button>
      <div className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </form>
  </div>
  );
};

export default Login;
