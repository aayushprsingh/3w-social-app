import React, { useState, useRef } from 'react';
import { Camera, Smile, AlignLeft, Megaphone, Send, X } from 'lucide-react';

function CreatePost({ token, onPostCreated }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [activeTab, setActiveTab] = useState('All Posts');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Convert uploaded image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    setUploading(true);
    reader.onloadend = () => {
      setImage(reader.result); // Base64 URL string
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text.trim(),
          imageUrl: image
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated(newPost);
        // Reset states
        setText('');
        setImage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      alert('Error connecting to server. Please try again.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const canPost = text.trim().length > 0 || image.length > 0;

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h3 className="create-post-title">Create Post</h3>
        <div className="toggle-switch-pills">
          <button 
            className={`toggle-pill ${activeTab === 'All Posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('All Posts')}
          >
            All Posts
          </button>
          <button 
            className={`toggle-pill ${activeTab === 'Promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('Promotions')}
          >
            Promotions
          </button>
        </div>
      </div>

      <div className="create-post-body">
        <textarea
          className="create-post-textarea"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        {image && (
          <div className="image-preview-wrapper">
            <img src={image} alt="Preview" className="image-preview" />
            <button className="remove-image-btn" onClick={removeImage} type="button">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="create-post-footer">
        <div className="create-post-actions">
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleImageChange}
          />
          <button className="create-post-action-btn" onClick={triggerFileInput} type="button" title="Attach Photo">
            <Camera size={18} />
          </button>
          
          <button className="create-post-action-btn" type="button" title="Emoji">
            <Smile size={18} />
          </button>

          <button className="create-post-action-btn" type="button" title="List options">
            <AlignLeft size={18} />
          </button>

          <button className="create-post-action-btn btn-promote" type="button" title="Promote">
            <Megaphone size={16} />
            <span>Promote</span>
          </button>
        </div>

        <button 
          className={`btn-post-send ${canPost ? 'active' : ''}`}
          onClick={handlePostSubmit}
          disabled={!canPost || uploading}
          type="button"
        >
          <Send size={14} />
          <span>Post</span>
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
