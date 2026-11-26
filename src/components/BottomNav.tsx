import React from 'react';
import { Compass, Heart, MessageCircle, Bookmark, UserRound, BarChart3 } from 'lucide-react';
import type { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  incomingCount: number;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  incomingCount,
  unreadCount
}) => {
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`bottom-tab ${activeTab === 'discover' ? 'active' : ''}`}
        onClick={() => setActiveTab('discover')}
      >
        <Compass size={19} />
        <span>Discover</span>
      </button>

      <button
        className={`bottom-tab ${activeTab === 'requests' ? 'active' : ''}`}
        onClick={() => setActiveTab('requests')}
      >
        <div className="tab-icon-wrap">
          <Heart size={19} />
          {incomingCount > 0 && <span className="tab-dot">{incomingCount}</span>}
        </div>
        <span>Requests</span>
      </button>

      <button
        className={`bottom-tab ${activeTab === 'chats' ? 'active' : ''}`}
        onClick={() => setActiveTab('chats')}
      >
        <div className="tab-icon-wrap">
          <MessageCircle size={19} />
          {unreadCount > 0 && <span className="tab-dot">{unreadCount}</span>}
        </div>
        <span>Chats</span>
      </button>

      <button
        className={`bottom-tab ${activeTab === 'saved' ? 'active' : ''}`}
        onClick={() => setActiveTab('saved')}
      >
        <Bookmark size={19} />
        <span>Saved</span>
      </button>

      <button
        className={`bottom-tab ${activeTab === 'insights' ? 'active' : ''}`}
        onClick={() => setActiveTab('insights')}
      >
        <BarChart3 size={19} />
        <span>Insights</span>
      </button>

      <button
        className={`bottom-tab ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <UserRound size={19} />
        <span>Profile</span>
      </button>
    </nav>
  );
};
