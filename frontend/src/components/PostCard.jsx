import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Send, Check } from 'lucide-react';

function PostCard({ post, currentUser, token, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [following, setFollowing] = useState(false);

  const isLiked = post.likes.includes(currentUser.username);
  
  const handleLike = async () => {
    // Optimistic UI updates
    const updatedLikes = isLiked 
      ? post.likes.filter(name => name !== currentUser.username)
      : [...post.likes, currentUser.username];
    
    // Trigger optimistic callback
    onPostUpdated({ ...post, likes: updatedLikes });

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Optimistic UI updates
    const tempComment = {
      username: currentUser.username,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };
    
    onPostUpdated({
      ...post,
      comments: [...post.comments, tempComment]
    });
    
    const textToSubmit = commentText;
    setCommentText('');

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToSubmit })
      });
      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Helper to format date
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Pinned/promotional criteria mimicking Nitin's post in screenshot 1
  const isPinned = post.username === 'Nitin Pandey' || post.username.toLowerCase().includes('admin');

  return (
    <div className={`post-card ${isPinned ? 'pinned' : ''}`}>
      {isPinned && (
        <div className="pin-icon-badge" title="Pinned Post">
          📌
        </div>
      )}

      <div className="post-card-header">
        <div className="post-user-info">
          <div className="avatar-circle">
            {post.username.charAt(0)}
          </div>
          <div className="post-user-details">
            <div className="post-username-wrapper">
              <span className="post-display-name">{post.username}</span>
              <span className="post-handle-name">@{post.username.toLowerCase()}</span>
              {isPinned && (
                <span className="verification-badge" title="Verified Creator">
                  <Check size={12} style={{ color: '#1877f2', fill: '#1877f2' }} />
                </span>
              )}
            </div>
            <span className="post-timestamp">{formatTime(post.createdAt)}</span>
          </div>
        </div>

        <button 
          className={`btn-follow ${following ? 'following' : ''}`}
          onClick={() => setFollowing(!following)}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      <div className="post-card-body">
        {isPinned && (
          <div className="earn-points-badge">
            <span>🪙 Post & Earn</span>
          </div>
        )}
        
        {post.text && <p className="post-text">{post.text}</p>}
        
        {post.imageUrl && (
          <div className="post-image-container">
            <img src={post.imageUrl} alt="Post Attachment" className="post-image" />
          </div>
        )}
      </div>

      <div className="post-card-footer">
        <button 
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart size={18} />
          <span>{post.likes.length}</span>
        </button>

        <button 
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={18} />
          <span>{post.comments.length}</span>
        </button>

        <button className="post-action-btn">
          <Share2 size={18} />
          <span>{isPinned ? '34' : '1'}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-drawer">
          <div className="comments-list">
            {post.comments.length === 0 ? (
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '10px 0' }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-user-header">
                    <span>{comment.username}</span>
                    <span className="comment-timestamp">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="comment-input-form">
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn-comment-submit">
              <Send size={12} style={{ color: 'white' }} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostCard;
