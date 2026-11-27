import React, { useState, useEffect, useRef } from 'react';
import { Send, Instagram, ShieldAlert, ArrowLeft, Sparkles, CheckCheck } from 'lucide-react';
import type { ActiveMatch } from '../types';
import { ICEBREAKER_PROMPTS } from '../data/mockData';
import { syncStore } from '../lib/syncStore';

interface ChatTabProps {
  matches: ActiveMatch[];
  activeMatchId: string | null;
  setActiveMatchId: (id: string | null) => void;
  onSendMessage: (matchId: string, text: string) => void;
  onShareInstagram: (matchId: string) => void;
  onUnmatch: (matchId: string) => void;
  userInstagramHandle: string;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  matches,
  activeMatchId,
  setActiveMatchId,
  onSendMessage,
  onShareInstagram,
  onUnmatch,
  userInstagramHandle
}) => {
  const [inputText, setInputText] = useState('');
  const [safetyMenuOpen, setSafetyMenuOpen] = useState(false);
  const [shareConfirmOpen, setShareConfirmOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMatch = matches.find((m) => m.id === activeMatchId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMatch?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatchId) return;
    onSendMessage(activeMatchId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeMatchId) return;
    onSendMessage(activeMatchId, prompt);
  };

  const handleConfirmShareHandle = () => {
    if (!activeMatchId) return;
    onShareInstagram(activeMatchId);
    setShareConfirmOpen(false);
  };

  return (
    <div className="tab-container chat-tab-layout">
      {/* Sidebar: Matches List */}
      <div className={`chat-sidebar ${activeMatch ? 'hide-on-mobile' : ''}`}>
        <div className="chat-sidebar-header">
          <div className="eyebrow">CAMPUS CONNECTIONS</div>
          <h2>Chats</h2>
          <p className="sidebar-sub">Private conversations with your mutual matches.</p>
        </div>

        <div className="matches-list">
          {matches.map((m) => {
            const isSelected = m.id === activeMatchId;
            return (
              <div
                key={m.id}
                className={`match-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveMatchId(m.id)}
              >
                <div
                  className="match-avatar"
                  style={{ background: m.profile.avatarGradient, color: m.profile.avatarColor }}
                >
                  <span>{m.profile.avatarChar}</span>
                </div>
                <div className="match-info">
                  <div className="match-top">
                    <h4>{m.profile.name}</h4>
                    <span className="match-time">{m.lastMessageTime || m.matchedAt}</span>
                  </div>
                  <p className="match-preview">{m.lastMessage || 'New connection! Say hello.'}</p>
                </div>
                {m.unreadCount && m.unreadCount > 0 ? (
                  <span className="unread-dot">{m.unreadCount}</span>
                ) : null}
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="empty-sidebar">
              <p>No active matches yet.</p>
              <span>Accept an incoming request or wait for someone to accept your hello!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Pane */}
      <div className={`chat-pane ${!activeMatch ? 'hide-on-mobile' : ''}`}>
        {activeMatch ? (
          <div className="conversation-container">
            {/* Header */}
            <div className="conversation-header">
              <button
                className="back-btn-mobile"
                onClick={() => setActiveMatchId(null)}
                title="Back to matches list"
              >
                <ArrowLeft size={18} />
              </button>

              <div
                className="header-avatar"
                style={{
                  background: activeMatch.profile.avatarGradient,
                  color: activeMatch.profile.avatarColor
                }}
              >
                <span>{activeMatch.profile.avatarChar}</span>
              </div>

              <div className="header-info">
                <h3>{activeMatch.profile.name}</h3>
                <p>{activeMatch.profile.studyYear} · {activeMatch.profile.course}</p>
              </div>

              <div className="header-actions">
                <button
                  className="share-handle-btn"
                  onClick={() => setShareConfirmOpen(true)}
                  title="Voluntarily share your Instagram handle"
                >
                  <Instagram size={15} />
                  <span className="desktop-only">Share Instagram</span>
                </button>

                <div className="safety-dropdown-wrap">
                  <button
                    className="menu-icon-btn"
                    onClick={() => setSafetyMenuOpen(!safetyMenuOpen)}
                    title="Safety & controls"
                  >
                    •••
                  </button>

                  {safetyMenuOpen && (
                    <div className="safety-dropdown-menu">
                      <button
                        onClick={() => {
                          setSafetyMenuOpen(false);
                          setReportModalOpen(true);
                        }}
                      >
                        <ShieldAlert size={15} /> Report student
                      </button>
                      <button
                        className="danger-text"
                        onClick={() => {
                          setSafetyMenuOpen(false);
                          onUnmatch(activeMatch.id);
                        }}
                      >
                        Unmatch connection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="messages-stream">
              <div className="privacy-banner">
                <Sparkles size={14} />
                <span>
                  This conversation is private between you and <strong>{activeMatch.profile.name}</strong>.
                  Personal social handles are shared only if you deliberately send them.
                </span>
              </div>

              {activeMatch.messages.map((msg) => {
                const isMe = msg.senderId === 'me';

                if (msg.type === 'instagram_share') {
                  return (
                    <div
                      key={msg.id}
                      className={`message-row ${isMe ? 'my-row' : 'their-row'}`}
                    >
                      <div className="instagram-card-bubble">
                        <div className="ig-card-header">
                          <Instagram size={18} />
                          <span>Voluntary Contact Share</span>
                        </div>
                        <p className="ig-card-text">
                          {isMe ? 'You shared your Instagram handle:' : `${activeMatch.profile.name} shared their handle:`}
                        </p>
                        <div className="ig-handle-tag">
                          {msg.sharedHandle}
                        </div>
                        <span className="msg-time">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`message-row ${isMe ? 'my-row' : 'their-row'}`}
                  >
                    <div className={`message-bubble ${isMe ? 'my-bubble' : 'their-bubble'}`}>
                      <p>{msg.text}</p>
                      <div className="msg-meta">
                        <span className="msg-time">{msg.timestamp}</span>
                        {isMe && <CheckCheck size={13} className="check-icon" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Icebreaker Prompts */}
            <div className="icebreakers-bar">
              <span className="icebreaker-label">Icebreakers:</span>
              <div className="icebreakers-scroll">
                {ICEBREAKER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="icebreaker-chip"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form className="chat-input-bar" onSubmit={handleSend}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeMatch.profile.name}...`}
                className="chat-text-input"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputText.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="no-chat-selected">
            <span className="no-chat-icon">💬</span>
            <h3>Select a conversation</h3>
            <p>Pick a matched student from the list to start chatting.</p>
          </div>
        )}
      </div>

      {/* Share Instagram Confirmation Modal */}
      {shareConfirmOpen && activeMatch && (
        <div className="modal-overlay" onClick={() => setShareConfirmOpen(false)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="hello-modal-header">
              <span className="hello-modal-icon">
                <Instagram size={22} />
              </span>
              <div>
                <h3>Share your Instagram handle?</h3>
                <p className="modal-sub">Explicit voluntary sharing with {activeMatch.profile.name}.</p>
              </div>
            </div>

            <div className="hello-modal-body">
              <p className="modal-text">
                Your handle <strong>{userInstagramHandle || '@your_handle'}</strong> will be displayed directly inside this private chat with {activeMatch.profile.name}. It will never be shown to anyone else on campus.
              </p>

              <div className="modal-actions-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setShareConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  onClick={handleConfirmShareHandle}
                >
                  Confirm & Share Handle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Student Modal */}
      {reportModalOpen && activeMatch && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="hello-modal-header">
              <span className="hello-modal-icon danger-icon">
                <ShieldAlert size={22} />
              </span>
              <div>
                <h3>Report {activeMatch.profile.name}</h3>
                <p className="modal-sub">Our campus moderation team takes student safety seriously.</p>
              </div>
            </div>

            <div className="hello-modal-body">
              <label className="input-label">Select reason:</label>
              <div className="custom-report-reasons">
                {[
                  { id: 'harassment', label: 'Harassment or inappropriate behavior' },
                  { id: 'spam', label: 'Commercial spam or bot' },
                  { id: 'fake', label: 'Fake profile or impersonation' },
                  { id: 'privacy', label: 'Attempting to coerce personal private info' },
                ].map((reason) => (
                  <button
                    type="button"
                    key={reason.id}
                    className={`custom-report-option ${reportReason === reason.id ? 'active' : ''}`}
                    onClick={() => setReportReason(reason.id)}
                  >
                    <span>{reason.label}</span>
                    {reportReason === reason.id && <span className="option-check">✓</span>}
                  </button>
                ))}
              </div>

              <div className="modal-actions-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setReportModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn danger-btn"
                  onClick={() => {
                    syncStore.submitHelpDeskQuery({
                      category: 'safety',
                      name: 'Anonymous Student',
                      isAnonymous: true,
                      message: `[Safety Report] Student reported user ${activeMatch.profile.name} (ID: ${activeMatch.profile.id}). Reason: ${reportReason}`
                    });
                    alert(`Report submitted for ${activeMatch.profile.name}. They have been blocked and unmatched.`);
                    onUnmatch(activeMatch.id);
                    setReportModalOpen(false);
                  }}
                  disabled={!reportReason}
                >
                  Submit Report & Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
