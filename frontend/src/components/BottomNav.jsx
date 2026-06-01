import React from 'react';
import { Home, ClipboardList, Globe, Trophy, MessageSquare } from 'lucide-react';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <button className="bottom-nav-item">
        <Home size={20} />
        <span>Home</span>
      </button>

      <button className="bottom-nav-item">
        <ClipboardList size={20} />
        <span>Tasks</span>
      </button>

      {/* Social is active sphere/pill exactly matching the bottom nav active style in screenshot */}
      <button className="bottom-nav-item active">
        <div className="active-sphere">
          <Globe size={20} />
        </div>
        <span>Social</span>
      </button>

      <button className="bottom-nav-item">
        <Trophy size={20} />
        <span>Leader Board</span>
      </button>

      <button className="bottom-nav-item">
        <MessageSquare size={20} />
        <span>Chat</span>
      </button>
    </div>
  );
}

export default BottomNav;
