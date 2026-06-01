import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Feed from './pages/Feed.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there's a token, fetch user details
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        console.error('Error validating token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogin = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="pulse-loader"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Feed user={user} onLogout={handleLogout} token={token} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
