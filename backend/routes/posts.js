const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   GET api/posts
// @desc    Get all posts (public feed)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// @route   POST api/posts/create
// @desc    Create a new post (text, image, or both)
// @access  Private
router.post('/create', auth, async (req, res) => {
  const { text, imageUrl } = req.body;

  // Make sure at least one field is provided
  if (!text && !imageUrl) {
    return res.status(400).json({ message: 'Post content cannot be empty. Please enter text or upload an image.' });
  }

  try {
    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      text,
      imageUrl,
      likes: [],
      comments: []
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   POST api/posts/:id/like
// @desc    Toggle like on a post for the authenticated user
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.id || req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const username = req.user.username;
    const likeIndex = post.likes.indexOf(username);

    if (likeIndex > -1) {
      // User has already liked - unlike it
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked - add like
      post.likes.push(username);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Like toggle error:', err);
    res.status(500).json({ message: 'Server error toggling like' });
  }
});

// @route   POST api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Comment text cannot be empty' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      username: req.user.username,
      text: text.trim()
    };

    post.comments.push(newComment);
    await post.save();
    
    res.status(201).json(post);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

module.exports = router;
