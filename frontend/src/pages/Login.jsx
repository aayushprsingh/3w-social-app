import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Info } from 'lucide-react';

function Login({ onLogin }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(false);

    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection refused. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">3W Social</h1>
          <p className="auth-subtitle">Login to connect & post tasks</p>
        </div>

        {error && (
          <div className="error-message">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-identity">Username or Email</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="login-identity"
                className="form-control"
                placeholder="Enter email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                id="login-password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
