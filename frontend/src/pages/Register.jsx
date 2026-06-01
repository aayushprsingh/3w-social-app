import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Info } from 'lucide-react';

function Register({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Registration failed. Try a different username/email.');
      }
    } catch (err) {
      console.error('Registration error:', err);
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
          <p className="auth-subtitle">Create an account to start interning</p>
        </div>

        {error && (
          <div className="error-message">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="reg-username"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                id="reg-email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                id="reg-password"
                className="form-control"
                placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
