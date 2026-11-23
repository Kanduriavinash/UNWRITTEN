import React, { useState } from 'react';
import { BookHeart, Compass, Heart, MessageCircle, Bookmark, UserRound, Shield, Users, RefreshCw } from 'lucide-react';
import { ALL_PERSONAS } from '../lib/syncStore';
import type { CurrentUserProfile } from '../types';

interface NavigationProps {
  activeTab: 'discover' | 'requests' | 'chats' | 'saved' | 'profile';
  setActiveTab: (tab: 'discover' | 'requests' | 'chats' | 'saved' | 'profile') => void;
  incomingCount: number;
  unreadCount: number;
  campusDomain: string;
  currentUser: CurrentUserProfile;
  onSwitchUser: (userId: string) => void;
  onResetDemo: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  incomingCount,
  unreadCount,
  campusDomain,
  currentUser,
  onSwitchUser,
  onResetDemo
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);

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
            {incomingCount > 0 && <span className="nav-badge pulse">{incomingCount}</span>}
          </button>

          <button
            className={`nav-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle size={17} />
            <span>Chats</span>
            {unreadCount > 0 && <span className="nav-badge pulse">{unreadCount}</span>}
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

        {/* Account Persona Switcher & Campus Badge */}
        <div className="nav-right">
          <div className="persona-switcher-wrap">
            <button
              className="persona-btn"
              onClick={() => setSwitcherOpen(!switcherOpen)}
              title="Switch campus account in this tab"
            >
              <Users size={14} />
              <span className="persona-name">Account: <strong>{currentUser.displayName}</strong></span>
              <span className="persona-arrow">▾</span>
            </button>

            {switcherOpen && (
              <div className="persona-dropdown">
                <div className="dropdown-tip">
                  <span>💡 Open another tab in your browser and switch to a different student to test live requests & chats between 2 accounts in real time!</span>
                </div>
                <div className="dropdown-label">Switch Current Tab Persona:</div>
                <div className="persona-list">
                  {ALL_PERSONAS.map((p) => {
                    const isCurrent = p.id === currentUser.id;
                    return (
                      <button
                        key={p.id}
                        className={`persona-option ${isCurrent ? 'active' : ''}`}
                        onClick={() => {
                          onSwitchUser(p.id);
                          setSwitcherOpen(false);
                        }}
                      >
                        <div className="option-avatar">
                          {p.displayName[0]}
                        </div>
                        <div className="option-info">
                          <strong>{p.displayName}</strong>
                          <span>{p.studyYear} · {p.course.split('&')[0]}</span>
                        </div>
                        {isCurrent && <span className="current-check">✓ Active</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="dropdown-footer">
                  <button
                    className="reset-demo-btn"
                    onClick={() => {
                      onResetDemo();
                      setSwitcherOpen(false);
                    }}
                  >
                    <RefreshCw size={12} /> Reset Campus Data
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="campus-badge" title="Verified Campus Community">
            <Shield size={12} className="shield-icon" />
            <span>@{campusDomain}</span>
          </span>
        </div>
      </div>
    </header>
  );
};
