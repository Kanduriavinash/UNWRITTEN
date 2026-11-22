import React, { useState } from 'react';
import { Heart, Check, X, ArrowRight, MessageCircle } from 'lucide-react';
import type { ConnectionRequest } from '../types';

interface RequestsTabProps {
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  onAcceptRequest: (request: ConnectionRequest) => void;
  onDeclineRequest: (requestId: string) => void;
  onWithdrawRequest: (requestId: string) => void;
  onNavigateToChat: () => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  incomingRequests,
  outgoingRequests,
  onAcceptRequest,
  onDeclineRequest,
  onWithdrawRequest,
  onNavigateToChat
}) => {
  const [subTab, setSubTab] = useState<'incoming' | 'outgoing'>('incoming');

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="eyebrow">CONNECTIONS & REQUESTS</div>
        <h2>Where conversations <em>begin.</em></h2>
        <p className="tab-subtitle">
          Mutual interest only. When both of you say yes, a private chat opens.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tab-selector">
        <button
          className={`sub-tab-btn ${subTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setSubTab('incoming')}
        >
          Incoming ({incomingRequests.length})
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setSubTab('outgoing')}
        >
          Outgoing ({outgoingRequests.length})
        </button>
      </div>

      {/* Incoming Requests List */}
      {subTab === 'incoming' && (
        <div className="requests-list">
          {incomingRequests.map((req) => (
            <article className="request-card" key={req.id}>
              <div
                className="request-avatar"
                style={{ background: req.senderGradient, color: req.senderColor }}
              >
                <span>{req.senderChar}</span>
              </div>

              <div className="request-info">
                <div className="request-top-line">
                  <h3>{req.senderName}</h3>
                  <span className="request-time">{req.timestamp}</span>
                </div>
                <p className="request-course">
                  {req.senderYear} · {req.senderCourse}
                </p>

                {req.note && (
                  <div className="request-note-box">
                    <span className="quote-symbol">“</span>
                    <p>{req.note}</p>
                  </div>
                )}

                <div className="card-tags mini">
                  {req.senderInterests.slice(0, 3).map((t) => (
                    <span key={t} className="interest-tag">{t}</span>
                  ))}
                </div>

                <div className="request-actions">
                  <button
                    className="decline-btn"
                    onClick={() => onDeclineRequest(req.id)}
                  >
                    <X size={15} /> Pass
                  </button>
                  <button
                    className="accept-btn"
                    onClick={() => onAcceptRequest(req)}
                  >
                    <Check size={15} /> Accept & Match ♡
                  </button>
                </div>
              </div>
            </article>
          ))}

          {incomingRequests.length === 0 && (
            <div className="empty-state-box">
              <span className="empty-icon-wrap">
                <Heart size={28} />
              </span>
              <h3>No new incoming requests</h3>
              <p>When someone discovers your story and sends a hello, it will appear right here.</p>
            </div>
          )}
        </div>
      )}

      {/* Outgoing Requests List */}
      {subTab === 'outgoing' && (
        <div className="requests-list">
          {outgoingRequests.map((req) => (
            <article className="request-card outgoing-card" key={req.id}>
              <div
                className="request-avatar"
                style={{ background: req.senderGradient, color: req.senderColor }}
              >
                <span>{req.senderChar}</span>
              </div>

              <div className="request-info">
                <div className="request-top-line">
                  <h3>Sent to {req.senderName}</h3>
                  <span className="status-pill pending">Pending response</span>
                </div>
                <p className="request-course">{req.senderCourse}</p>

                {req.note && (
                  <div className="request-note-box outgoing-note">
                    <p>Your note: “{req.note}”</p>
                  </div>
                )}

                <div className="outgoing-actions">
                  <span className="request-time">{req.timestamp}</span>
                  <button
                    className="withdraw-btn"
                    onClick={() => onWithdrawRequest(req.id)}
                  >
                    Withdraw request
                  </button>
                </div>
              </div>
            </article>
          ))}

          {outgoingRequests.length === 0 && (
            <div className="empty-state-box">
              <span className="empty-icon-wrap">
                <ArrowRight size={28} />
              </span>
              <h3>No pending outgoing requests</h3>
              <p>Explore student profiles in the Discover tab and send a friendly hello!</p>
            </div>
          )}
        </div>
      )}

      <div className="requests-footer-tip">
        <MessageCircle size={16} />
        <span>Accepted connections immediately unlock your private conversation in the <strong>Chats</strong> tab.</span>
        <button className="text-link" onClick={onNavigateToChat}>Go to Chats →</button>
      </div>
    </div>
  );
};
