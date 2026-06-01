import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { Search, Moon, Sun, Plus } from 'lucide-react';

function Feed({ user, token, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Post');

  // Load posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Toggle dark/light theme
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Add newly created post instantly to the top of feed
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Handle instant state update for likes and comments
  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Simple filter in memory for demonstration
  };

  // Filter and search logic
  const filteredPosts = posts.filter(post => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const textMatch = post.text && post.text.toLowerCase().includes(query);
      const userMatch = post.username.toLowerCase().includes(query);
      if (!textMatch && !userMatch) return false;
    }
    
    // 2. Active Tab Filters
    if (activeFilter === 'Most Liked') {
      // Show those with likes first
      return post.likes.length > 0;
    }
    if (activeFilter === 'Most Commented') {
      // Show those with comments first
      return post.comments.length > 0;
    }
    return true;
  });

  return (
    <div className="app-container">
      {/* Navbar (Top bar) */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Sub-navbar with search and toggles */}
      <div className="sub-navbar">
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search promotions, users, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <Search size={14} />
          </button>
        </form>

        <div className="sub-nav-toggles">
          <button className="nav-icon-btn" onClick={toggleDarkMode} title="Toggle Theme">
            {darkMode ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} />}
          </button>
          {user && (
            <div className="avatar-circle" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
              {user.username.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Widget */}
      <CreatePost token={token} onPostCreated={handleNewPost} />

      {/* Feed Filters strip matching Screenshot 1 */}
      <div className="feed-filter-bar">
        {['All Post', 'For You', 'Most Liked', 'Most Commented', 'Most Shared'].map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="post-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            <div className="pulse-loader" style={{ margin: '0 auto 16px auto' }}></div>
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>No Posts Found</p>
            <p style={{ fontSize: '13px' }}>Be the first one to create a post using the panel above!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              token={token}
              onPostUpdated={handlePostUpdate}
            />
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) matching screenshot */}
      <button 
        className="fab-btn" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Create New Post"
      >
        <Plus size={22} />
      </button>

      {/* App Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Feed;
