import React from 'react';
import { Bell, LogOut, Coins, ShieldAlert } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-title">
        Social
      </div>
      
      <div className="nav-actions">
        {/* Piles matching screenshot 1 exactly */}
        <div className="pill-badge star">
          <span style={{ color: '#eab308' }}>★</span>
          <span>56</span>
        </div>
        
        <div className="pill-badge rupee">
          <span>₹</span>
          <span>0.00</span>
        </div>

        <button className="nav-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="dot-indicator"></span>
        </button>

        {user && (
          <div className="avatar-circle" title={`Logged in as ${user.username}`}>
            {user.username.charAt(0)}
          </div>
        )}

        <button className="nav-icon-btn" onClick={onLogout} title="Log Out">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
