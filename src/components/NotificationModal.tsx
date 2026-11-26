import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, Sparkles, Rocket, Heart, MessageCircle, ShieldCheck, CheckCheck, Trash2, ArrowRight, Smartphone } from 'lucide-react';
import { notificationManager, type CampusNotification } from '../lib/notifications';
import type { NavTab } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenInstallModal?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenInstallModal
}) => {
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [filter, setFilter] = useState<'all' | 'update' | 'request' | 'chat'>('all');
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    const unsub = notificationManager.subscribe((list) => {
      setNotifications(list);
    });
    setPermission(notificationManager.getPermission());
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await notificationManager.requestPermission();
    setPermission(res);
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    await notificationManager.sendTestNotification();
    setTimeout(() => setIsSendingTest(false), 1200);
  };

  const handleActionClick = (notif: CampusNotification) => {
    notificationManager.markAsRead(notif.id);
    if (notif.actionLabel === 'Install App' && onOpenInstallModal) {
      onClose();
      onOpenInstallModal();
      return;
    }
    if (notif.linkTab) {
      onClose();
      onNavigateTab(notif.linkTab);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIconForType = (type: CampusNotification['type']) => {
    switch (type) {
      case 'update':
        return <Rocket size={16} className="notif-type-icon update" />;
      case 'request':
        return <Heart size={16} className="notif-type-icon request" />;
      case 'chat':
        return <MessageCircle size={16} className="notif-type-icon chat" />;
      case 'security':
        return <ShieldCheck size={16} className="notif-type-icon security" />;
      default:
        return <Sparkles size={16} className="notif-type-icon system" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notification-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="notif-modal-title-group">
            <div className="notif-bell-badge">
              <BellRing size={20} className="bell-ring-icon" />
            </div>
            <div>
              <div className="notif-title-row">
                <h3>Campus Updates & Notifications</h3>
                {unreadCount > 0 && <span className="unread-pill">{unreadCount} New</span>}
              </div>
              <p className="modal-subtitle">Stay tuned for campus announcements, requests & whispers</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Device Push Notification Banner */}
        <div className="notif-permission-banner">
          <div className="banner-left">
            <Bell size={18} className="banner-icon" />
            <div>
              {permission === 'granted' ? (
                <>
                  <strong>Device Push Notifications Active 🔔</strong>
                  <p>You will receive instant system alerts on your phone screen.</p>
                </>
              ) : permission === 'denied' ? (
                <>
                  <strong>Device Notifications Blocked</strong>
                  <p>System alerts are muted in your browser. In-app alerts remain active.</p>
                </>
              ) : (
                <>
                  <strong>Enable Phone / Device Push Notifications</strong>
                  <p>Get notified instantly when new campus requests or updates arrive.</p>
                </>
              )}
            </div>
          </div>

          <div className="banner-actions">
            {permission !== 'granted' && permission !== 'denied' && (
              <button className="enable-perm-btn" onClick={handleRequestPermission}>
                Enable Now
              </button>
            )}
            <button
              className="test-notif-btn"
              onClick={handleSendTest}
              disabled={isSendingTest}
              title="Test real-time alert sound & popup"
            >
              {isSendingTest ? 'Testing...' : 'Test Alert 🧪'}
            </button>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="notif-filter-bar">
          <div className="filter-pill-group">
            <button
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-pill ${filter === 'update' ? 'active' : ''}`}
              onClick={() => setFilter('update')}
            >
              Updates
            </button>
            <button
              className={`filter-pill ${filter === 'request' ? 'active' : ''}`}
              onClick={() => setFilter('request')}
            >
              Requests
            </button>
            <button
              className={`filter-pill ${filter === 'chat' ? 'active' : ''}`}
              onClick={() => setFilter('chat')}
            >
              Chats
            </button>
          </div>

          <div className="notif-bulk-actions">
            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={() => notificationManager.markAllAsRead()}
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="clear-all-btn"
                onClick={() => notificationManager.clearAll()}
                title="Clear notification list"
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scroll Area */}
        <div className="notif-list-body">
          {filtered.length === 0 ? (
            <div className="empty-notif-state">
              <Bell size={32} className="empty-bell-icon" />
              <h4>No notifications right now</h4>
              <p>Everything in your campus sanctuary is quiet and up-to-date.</p>
              <button className="test-notif-btn mt-2" onClick={handleSendTest}>
                Send a Test Notification 🧪
              </button>
            </div>
          ) : (
            <div className="notif-items-container">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`notif-item-card ${!item.read ? 'unread' : 'read'}`}
                  onClick={() => notificationManager.markAsRead(item.id)}
                >
                  <div className="notif-icon-col">{getIconForType(item.type)}</div>
                  <div className="notif-content-col">
                    <div className="notif-item-top">
                      <strong className="notif-item-title">{item.title}</strong>
                      <span className="notif-timestamp">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    <p className="notif-item-body">{item.body}</p>

                    <div className="notif-item-bottom">
                      {item.actionLabel && (
                        <button
                          className="notif-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(item);
                          }}
                        >
                          {item.actionLabel === 'Install App' && <Smartphone size={12} className="mr-1" />}
                          <span>{item.actionLabel}</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                      {!item.read && <span className="unread-dot-badge">●</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer notif-footer">
          <span className="campus-live-badge">⚡ Real-Time Campus Notification Bus Active</span>
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
