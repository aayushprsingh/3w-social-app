const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists (by email or username)
    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: emailLower }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = new User({
      username,
      email: emailLower,
      password
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Find user by email or username
    const lookup = emailOrUsername.includes('@')
      ? { email: emailOrUsername.toLowerCase() }
      : { username: emailOrUsername };

    const user = await User.findOne(lookup);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET api/auth/me
// @desc    Get current user details using token
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ message: 'Server error verifying authorization status' });
  }
});

module.exports = router;
