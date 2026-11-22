import React from 'react';
import { BookHeart, Compass, Heart, MessageCircle, Bookmark, UserRound, Shield } from 'lucide-react';

interface NavigationProps {
  activeTab: 'discover' | 'requests' | 'chats' | 'saved' | 'profile';
  setActiveTab: (tab: 'discover' | 'requests' | 'chats' | 'saved' | 'profile') => void;
  incomingCount: number;
  unreadCount: number;
  campusDomain: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  incomingCount,
  unreadCount,
  campusDomain
}) => {
  return (
    <header className="nav-header">
      <div className="nav-container">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); setActiveTab('discover'); }}>
          <span className="brand-icon">
            <BookHeart size={22} />
          </span>
          <span className="brand-text">
            unwritten<span className="dot">.</span>
          </span>
        </a>

        {/* Desktop Tabs */}
        <nav className="desktop-nav">
          <button
            className={`nav-btn ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            <Compass size={17} />
            <span>Discover</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <Heart size={17} />
            <span>Requests</span>
            {incomingCount > 0 && <span className="nav-badge">{incomingCount}</span>}
          </button>

          <button
            className={`nav-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle size={17} />
            <span>Chats</span>
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </button>

          <button
            className={`nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={17} />
            <span>Saved</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserRound size={17} />
            <span>My Story</span>
          </button>
        </nav>

        <div className="nav-right">
          <span className="campus-badge" title="Verified Campus Community">
            <Shield size={12} className="shield-icon" />
            <span>@{campusDomain}</span>
          </span>
        </div>
      </div>
    </header>
  );
};
