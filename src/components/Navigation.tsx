import React, { useState, useRef, useEffect } from 'react';
import { BookHeart, Compass, Heart, MessageCircle, Bookmark, UserRound, Shield, RefreshCw, Sparkles, Volume2, VolumeX, HelpCircle, BarChart3, Bell, Download, Smartphone } from 'lucide-react';
import type { CurrentUserProfile, NavTab } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  incomingCount: number;
  unreadCount: number;
  unreadNotificationsCount: number;
  campusDomain: string;
  currentUser: CurrentUserProfile;
  onSwitchUser?: (userId: string) => void;
  onResetDemo: () => void;
  onOpenPrologue: () => void;
  onOpenHelpDesk: () => void;
  onOpenNotifications: () => void;
  onOpenInstall: () => void;
  isStandaloneApp: boolean;
  isAudioActive: boolean;
  onToggleAudio: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  incomingCount,
  unreadCount,
  unreadNotificationsCount,
  campusDomain,
  currentUser,
  onResetDemo,
  onOpenPrologue,
  onOpenHelpDesk,
  onOpenNotifications,
  onOpenInstall,
  isStandaloneApp,
  isAudioActive,
  onToggleAudio
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    if (switcherOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [switcherOpen]);

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="brand-group">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); setActiveTab('discover'); }}>
            <span className="brand-icon">
              <BookHeart size={22} />
            </span>
            <span className="brand-text">
              unwritten<span className="dot">.</span>
            </span>
          </a>

          {/* Experience The Story Prologue Button */}
          <button
            className="prologue-nav-pill"
            onClick={onOpenPrologue}
            title="Experience the Story Prologue"
          >
            <Sparkles size={13} className="sparkle-spin" />
            <span>The Story</span>
          </button>

          {/* Campus Help Desk & Guide Button */}
          <button
            className="helpdesk-nav-pill"
            onClick={onOpenHelpDesk}
            title="Campus Help Desk, Safety & Suggestions"
          >
            <HelpCircle size={13} />
            <span>Help Desk</span>
          </button>

          {/* Campus Insights Pill */}
          <button
            className={`insights-nav-pill ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
            title="Live Campus & Platform Insights"
          >
            <BarChart3 size={13} />
            <span>Insights</span>
          </button>

          {/* Install App Pill */}
          {!isStandaloneApp && (
            <button
              className="install-nav-pill"
              onClick={onOpenInstall}
              title="Install UNWRITTEN App on your mobile or desktop"
            >
              <Download size={13} />
              <span>Install App</span>
            </button>
          )}
        </div>

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
            className={`nav-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <BarChart3 size={17} />
            <span>App Insights</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserRound size={17} />
            <span>My Story</span>
          </button>
        </nav>

        {/* Right Section: Soundscape Toggle, Notification Bell, Account Persona Switcher, Campus Badge */}
        <div className="nav-right">
          {/* Notification Bell Button */}
          <button
            className="nav-icon-btn nav-bell-btn"
            onClick={onOpenNotifications}
            title="Campus Updates & Notifications"
            aria-label="Campus Updates & Notifications"
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 && (
              <span className="nav-badge pulse bell-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          {/* Soundscape button */}
          <button
            className={`nav-sound-btn ${isAudioActive ? 'active' : ''}`}
            onClick={onToggleAudio}
            title={isAudioActive ? 'Soundscape On (Click to Mute)' : 'Soundscape Off (Click to Play)'}
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {isAudioActive && (
              <span className="mini-waves">
                <span className="mw1" />
                <span className="mw2" />
                <span className="mw3" />
              </span>
            )}
          </button>

          {/* Student Profile Quick Menu */}
          <div className="persona-switcher-wrap" ref={switcherRef}>
            <button
              className="persona-btn account-profile-btn"
              onClick={() => setSwitcherOpen(!switcherOpen)}
              aria-expanded={switcherOpen}
              title="Student Account & Menu"
            >
              <div className="account-nav-avatar">
                {currentUser.displayName && currentUser.displayName !== 'Campus Member'
                  ? currentUser.displayName[0].toUpperCase()
                  : '✦'}
              </div>
              <span className="persona-name">
                {currentUser.displayName && currentUser.displayName !== 'Campus Member'
                  ? currentUser.displayName
                  : 'My Story'}
              </span>
              {currentUser.isIdVerified && <VerifiedBadge size={13} />}
              <span className="persona-arrow">▾</span>
            </button>

            {switcherOpen && (
              <div className="persona-dropdown account-profile-dropdown">
                <div className="account-dropdown-card">
                  <div className="account-avatar-large">
                    {currentUser.displayName && currentUser.displayName !== 'Campus Member'
                      ? currentUser.displayName[0].toUpperCase()
                      : '✦'}
                  </div>
                  <div className="account-details">
                    <strong className="account-name-text">
                      <span>
                        {currentUser.displayName && currentUser.displayName !== 'Campus Member'
                          ? currentUser.displayName
                          : 'Campus Storyteller'}
                      </span>
                      {currentUser.isIdVerified && <VerifiedBadge size={13} />}
                    </strong>
                    <span className="account-subtext">
                      {currentUser.studyYear} · {currentUser.course.split('&')[0]}
                    </span>
                    <span className="account-campus-tag">
                      <Shield size={11} /> @{campusDomain} Verified
                    </span>
                  </div>
                </div>

                <div className="account-dropdown-actions">
                  <button
                    className="account-action-item"
                    onClick={() => {
                      setActiveTab('profile');
                      setSwitcherOpen(false);
                    }}
                  >
                    <UserRound size={14} />
                    <span>View / Edit My Story</span>
                  </button>

                  <button
                    className="account-action-item"
                    onClick={() => {
                      setActiveTab('insights');
                      setSwitcherOpen(false);
                    }}
                  >
                    <BarChart3 size={14} />
                    <span>Live Campus Insights (9 Sets)</span>
                  </button>

                  <button
                    className="account-action-item"
                    onClick={() => {
                      setSwitcherOpen(false);
                      onOpenNotifications();
                    }}
                  >
                    <Bell size={14} />
                    <span>Campus Updates & Alerts</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="dropdown-counter-badge">{unreadNotificationsCount}</span>
                    )}
                  </button>

                  {!isStandaloneApp && (
                    <button
                      className="account-action-item"
                      onClick={() => {
                        setSwitcherOpen(false);
                        onOpenInstall();
                      }}
                    >
                      <Smartphone size={14} />
                      <span>Install UNWRITTEN App 📲</span>
                    </button>
                  )}

                  <button
                    className="account-action-item"
                    onClick={() => {
                      setSwitcherOpen(false);
                      onOpenHelpDesk();
                    }}
                  >
                    <HelpCircle size={14} />
                    <span>Campus Help Desk & Guide</span>
                  </button>

                  <button
                    className="account-action-item"
                    onClick={() => {
                      setSwitcherOpen(false);
                      onOpenPrologue();
                    }}
                  >
                    <Sparkles size={14} />
                    <span>The Story Prologue</span>
                  </button>
                </div>

                <div className="dropdown-footer">
                  <button
                    className="reset-demo-btn"
                    onClick={() => {
                      onResetDemo();
                      setSwitcherOpen(false);
                    }}
                    title="Clear cached local student data on this device"
                  >
                    <RefreshCw size={12} /> Clear Local Data
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
