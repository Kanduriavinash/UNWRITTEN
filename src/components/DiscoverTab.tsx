import React, { useState } from 'react';
import { Sparkles, Heart, HeartHandshake, Bookmark, ArrowUpRight, LockKeyhole, MessageSquareQuote, Check } from 'lucide-react';
import type { StudentProfile, SeekingIntent } from '../types';
import { INTEREST_TAGS } from '../data/mockData';

interface DiscoverTabProps {
  profiles: StudentProfile[];
  savedIds: string[];
  sentRequestIds: string[];
  onToggleSave: (profileId: string) => void;
  onSendHello: (profile: StudentProfile, customNote?: string) => void;
  userInterests: string[];
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  profiles,
  savedIds,
  sentRequestIds,
  onToggleSave,
  onSendHello,
  userInterests
}) => {
  const [intentFilter, setIntentFilter] = useState<SeekingIntent>('Everyone');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeStoryModal, setActiveStoryModal] = useState<StudentProfile | null>(null);
  const [helloModalProfile, setHelloModalProfile] = useState<StudentProfile | null>(null);
  const [customNote, setCustomNote] = useState<string>('');

  // Filtering
  const filteredProfiles = profiles.filter((profile) => {
    // Intent filter
    if (intentFilter === 'Friendship' && profile.seeking === 'dating') return false;
    if (intentFilter === 'Dating' && profile.seeking === 'friendship') return false;

    // Tag filter
    if (selectedTag !== 'All' && !profile.interests.includes(selectedTag)) return false;

    return true;
  });

  const handleOpenHelloModal = (profile: StudentProfile) => {
    if (sentRequestIds.includes(profile.id)) return;
    setHelloModalProfile(profile);
    setCustomNote(`Hey ${profile.name}! Saw we both like ${profile.interests[0] || 'good conversations'}. Would love to connect!`);
  };

  const handleConfirmHello = () => {
    if (helloModalProfile) {
      onSendHello(helloModalProfile, customNote.trim());
      setHelloModalProfile(null);
      setCustomNote('');
    }
  };

  return (
    <div className="tab-container">
      {/* Hero Welcome */}
      <section className="discover-hero">
        <div className="eyebrow">
          <Sparkles size={14} /> A LITTLE SPACE FOR SOMETHING REAL
        </div>
        <h1>
          Not every story<br />begins with a <em>plan.</em>
        </h1>
        <p className="hero-description">
          Discover students from your campus through shared interests, quiet passions, and unhurried conversations.
        </p>

        <div className="hero-pills">
          <div className="trust-pill">
            <LockKeyhole size={14} />
            <span>Private details stay private until you both choose to share.</span>
          </div>
          <div className="trust-pill intent-pill">
            <HeartHandshake size={14} />
            <span>Open for friendship, dating, or seeing where things go.</span>
          </div>
        </div>
      </section>

      {/* Discovery Controls */}
      <section className="discovery-header">
        <div className="section-title-wrap">
          <div className="eyebrow">YOUR CORNER OF CAMPUS</div>
          <h2>People you might <em>click with.</em></h2>
        </div>

        {/* Intent filter */}
        <div className="intent-filters">
          {(['Everyone', 'Friendship', 'Dating'] as SeekingIntent[]).map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${intentFilter === tab ? 'active' : ''}`}
              onClick={() => setIntentFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Interest Tag Filter */}
      <div className="tags-scroll-container">
        {INTEREST_TAGS.map((tag) => (
          <button
            key={tag}
            className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="profile-cards-grid">
        {filteredProfiles.map((p) => {
          const isSaved = savedIds.includes(p.id);
          const isHelloSent = sentRequestIds.includes(p.id);

          return (
            <article className="profile-card" key={p.id}>
              {/* Card Header / Portrait */}
              <div
                className="card-portrait"
                style={{ background: p.avatarGradient, color: p.avatarColor }}
              >
                <span className="portrait-letter">{p.avatarChar}</span>
                <span className="card-seeking-badge">
                  {p.seeking === 'both' ? 'Friendship & Dating' : p.seeking === 'dating' ? 'Dating' : 'Friendship'}
                </span>
                <button
                  className={`save-icon-btn ${isSaved ? 'saved' : ''}`}
                  onClick={() => onToggleSave(p.id)}
                  title={isSaved ? 'Remove from Saved' : 'Save profile'}
                >
                  <Bookmark size={16} fill={isSaved ? '#806097' : 'none'} />
                </button>
              </div>

              {/* Card Body */}
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

                {/* Interest chips with shared highlight */}
                <div className="card-tags">
                  {p.interests.map((interest) => {
                    const isShared = userInterests.includes(interest);
                    return (
                      <span
                        key={interest}
                        className={`interest-tag ${isShared ? 'shared' : ''}`}
                      >
                        {isShared && <Sparkles size={11} className="shared-sparkle" />}
                        {interest}
                      </span>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="card-actions">
                  <button
                    className="detail-btn"
                    onClick={() => setActiveStoryModal(p)}
                  >
                    Story details
                  </button>

                  <button
                    className={`hello-btn ${isHelloSent ? 'sent' : ''}`}
                    onClick={() => handleOpenHelloModal(p)}
                    disabled={isHelloSent}
                  >
                    {isHelloSent ? (
                      <>
                        <Check size={14} /> Hello sent
                      </>
                    ) : (
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

      {filteredProfiles.length === 0 && (
        <div className="empty-discovery">
          <p>No profiles found matching this filter.</p>
          <button
            className="reset-filter-btn"
            onClick={() => { setIntentFilter('Everyone'); setSelectedTag('All'); }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Story Details Modal */}
      {activeStoryModal && (
        <div className="modal-overlay" onClick={() => setActiveStoryModal(null)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-banner"
              style={{ background: activeStoryModal.avatarGradient, color: activeStoryModal.avatarColor }}
            >
              <span className="modal-avatar-char">{activeStoryModal.avatarChar}</span>
              <button className="modal-close-btn" onClick={() => setActiveStoryModal(null)}>×</button>
            </div>

            <div className="modal-content">
              <div className="modal-eyebrow">STUDENT PROFILE</div>
              <h2>{activeStoryModal.name}, {activeStoryModal.age}</h2>
              <p className="modal-sub">{activeStoryModal.studyYear} · {activeStoryModal.course}</p>

              <div className="modal-section">
                <div className="section-label">
                  <MessageSquareQuote size={15} /> A LITTLE STORY NOTE
                </div>
                <p className="modal-quote">“{activeStoryModal.note}”</p>
              </div>

              <div className="modal-section">
                <div className="section-label">ABOUT THEM</div>
                <p>{activeStoryModal.bio}</p>
              </div>

              {activeStoryModal.favoriteHangout && (
                <div className="modal-section">
                  <div className="section-label">CAMPUS SPOT</div>
                  <p className="highlight-text">{activeStoryModal.favoriteHangout}</p>
                </div>
              )}

              {activeStoryModal.musicTaste && (
                <div className="modal-section">
                  <div className="section-label">MUSIC ON REPEAT</div>
                  <p className="highlight-text">{activeStoryModal.musicTaste}</p>
                </div>
              )}

              <div className="modal-section">
                <div className="section-label">INTERESTS</div>
                <div className="card-tags">
                  {activeStoryModal.interests.map((t) => (
                    <span key={t} className="interest-tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="modal-privacy-box">
                <LockKeyhole size={16} />
                <span>Instagram handle and personal contact are private and shared only if you both match.</span>
              </div>

              <div className="modal-actions-footer">
                <button
                  className="secondary-btn"
                  onClick={() => {
                    onToggleSave(activeStoryModal.id);
                    setActiveStoryModal(null);
                  }}
                >
                  {savedIds.includes(activeStoryModal.id) ? 'Remove from Saved' : 'Save for later'}
                </button>
                <button
                  className="primary-btn"
                  onClick={() => {
                    handleOpenHelloModal(activeStoryModal);
                    setActiveStoryModal(null);
                  }}
                  disabled={sentRequestIds.includes(activeStoryModal.id)}
                >
                  {sentRequestIds.includes(activeStoryModal.id) ? 'Hello already sent ✓' : 'Say hello ↗'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Say Hello Note Modal */}
      {helloModalProfile && (
        <div className="modal-overlay" onClick={() => setHelloModalProfile(null)}>
          <div className="story-modal-card hello-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hello-modal-header">
              <span className="hello-modal-icon">
                <Heart size={20} />
              </span>
              <div>
                <h3>Say hello to {helloModalProfile.name}</h3>
                <p className="modal-sub">Connections only happen when both students accept.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setHelloModalProfile(null)}>×</button>
            </div>

            <div className="hello-modal-body">
              <label className="input-label">
                Include a thoughtful introductory note (optional):
              </label>
              <textarea
                className="hello-textarea"
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Mention a shared interest or recommend a favorite song..."
              />

              <div className="quick-prompts-label">Tap to paste an icebreaker:</div>
              <div className="quick-prompts-wrap">
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => setCustomNote(`Hey! What is your favorite quiet corner on campus?`)}
                >
                  Campus corner?
                </button>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => setCustomNote(`Hey! Ginger chai or cold coffee?`)}
                >
                  Chai or coffee?
                </button>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => setCustomNote(`Hey! Recommend me one song you cannot stop listening to lately.`)}
                >
                  Song recommendation?
                </button>
              </div>

              <div className="modal-actions-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setHelloModalProfile(null)}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  onClick={handleConfirmHello}
                >
                  Send connection request ♡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
