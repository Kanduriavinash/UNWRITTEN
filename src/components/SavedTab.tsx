import React from 'react';
import { Bookmark, ArrowUpRight, Sparkles, Trash2 } from 'lucide-react';
import type { StudentProfile } from '../types';

interface SavedTabProps {
  savedProfiles: StudentProfile[];
  sentRequestIds: string[];
  onRemoveSaved: (profileId: string) => void;
  onSendHello: (profile: StudentProfile) => void;
  onNavigateToDiscover: () => void;
}

export const SavedTab: React.FC<SavedTabProps> = ({
  savedProfiles,
  sentRequestIds,
  onRemoveSaved,
  onSendHello,
  onNavigateToDiscover
}) => {
  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="eyebrow">YOUR BOOKMARKS</div>
        <h2>Stories saved for <em>later.</em></h2>
        <p className="tab-subtitle">
          Take your time. No rush, no expiring timers. Revisit these profiles whenever you are ready.
        </p>
      </div>

      {savedProfiles.length > 0 ? (
        <div className="profile-cards-grid">
          {savedProfiles.map((p) => {
            const isHelloSent = sentRequestIds.includes(p.id);

            return (
              <article className="profile-card" key={p.id}>
                <div
                  className="card-portrait"
                  style={{ background: p.avatarGradient, color: p.avatarColor }}
                >
                  <span className="portrait-letter">{p.avatarChar}</span>
                  <button
                    className="save-icon-btn saved"
                    onClick={() => onRemoveSaved(p.id)}
                    title="Remove from saved"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="card-body">
                  <div className="card-meta-line">
                    <span className="meta-text">{p.studyYear}</span>
                    <span className="meta-dot">·</span>
                    <span className="meta-text">{p.course}</span>
                  </div>

                  <div className="card-name-row">
                    <h3>
                      {p.name}
                      <span className="age-tag"> · {p.age}+</span>
                    </h3>
                  </div>

                  <p className="card-note">“{p.note}”</p>
                  <p className="card-bio">{p.bio}</p>

                  <div className="card-tags">
                    {p.interests.map((interest) => (
                      <span key={interest} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button
                      className="detail-btn"
                      onClick={() => onRemoveSaved(p.id)}
                    >
                      Remove
                    </button>

                    <button
                      className={`hello-btn ${isHelloSent ? 'sent' : ''}`}
                      onClick={() => onSendHello(p)}
                      disabled={isHelloSent}
                    >
                      {isHelloSent ? 'Hello sent ✓' : (
                        <>
                          Say hello <ArrowUpRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-box">
          <span className="empty-icon-wrap">
            <Bookmark size={32} />
          </span>
          <h3>No saved profiles yet</h3>
          <p>Tap the bookmark icon on any student profile in Discover to save it for quiet reflection.</p>
          <button className="primary-btn" onClick={onNavigateToDiscover}>
            <Sparkles size={16} /> Explore Campus Discover
          </button>
        </div>
      )}
    </div>
  );
};
