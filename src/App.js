import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import ChatApp from './components/chatApp';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('token') || null);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={<Register setUserId={setUserId} />} 
        />
        <Route
          path="/login"
          element={<Login setUserId={setUserId} />}
        />
        <Route
          path="/"
          element={userId ? <ChatApp currentUserId={userId} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
