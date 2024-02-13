import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import ChatApp from './components/chatApp';
import InternetStatusChecker from './OnlineChecker';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('token') || null);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={userId ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login"
          element={userId ? <Navigate to="/" /> : <Login userId={setUserId} />}
        />
        <Route
          path="/"
          element={userId ? (
            <InternetStatusChecker online={<ChatApp currentUserId={userId} />} />
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
