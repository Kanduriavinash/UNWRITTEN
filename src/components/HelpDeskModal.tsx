import React, { useState } from 'react';
import { HelpCircle, Sparkles, ShieldCheck, HeartHandshake, LockKeyhole, Send, MessageSquarePlus, CheckCircle2, MessageSquare } from 'lucide-react';
import type { HelpDeskCategory, HelpDeskQuery } from '../types';
import { syncStore } from '../lib/syncStore';
import { soundscape } from '../lib/soundscapes';

interface HelpDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeDomain: string;
}

export const HelpDeskModal: React.FC<HelpDeskModalProps> = ({
  isOpen,
  onClose,
  collegeDomain
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guide' | 'faqs' | 'submit' | 'queries'>('guide');

  // Submit form state
  const [category, setCategory] = useState<HelpDeskCategory>('feature');
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<HelpDeskQuery | null>(null);

  if (!isOpen) return null;

  const queries = syncStore.getHelpDeskQueries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newQuery = syncStore.submitHelpDeskQuery({
      category,
      name: isAnonymous ? 'Anonymous Student 🙈' : (name.trim() || 'Campus Student'),
      isAnonymous,
      email: email.trim(),
      message: message.trim()
    });

    soundscape.playChime(1046.5);
    setSubmittedTicket(newQuery);
    setMessage('');
    setName('');
    setEmail('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="helpdesk-modal-box"
        role="dialog"
        aria-modal="true"
        aria-label="Campus Help Desk and Community Guide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="helpdesk-header">
          <div className="helpdesk-header-brand">
            <span className="helpdesk-icon-badge">
              <HelpCircle size={22} />
            </span>
            <div>
              <h2>Campus Help Desk & Guide</h2>
              <p className="helpdesk-sub">
                Learn how UNWRITTEN works, read campus FAQs, or submit queries, ideas & requests.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" aria-label="Close Help Desk" onClick={onClose}>×</button>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="helpdesk-tabs-bar" role="tablist">
          <button
            type="button"
            className={`helpdesk-tab-btn ${activeSubTab === 'guide' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('guide'); setSubmittedTicket(null); }}
          >
            <Sparkles size={14} />
            <span>How It Works</span>
          </button>

          <button
            type="button"
            className={`helpdesk-tab-btn ${activeSubTab === 'faqs' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('faqs'); setSubmittedTicket(null); }}
          >
            <HelpCircle size={14} />
            <span>Campus FAQs</span>
          </button>

          <button
            type="button"
            className={`helpdesk-tab-btn ${activeSubTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('submit')}
          >
            <MessageSquarePlus size={14} />
            <span>Submit Request & Ideas</span>
          </button>

          <button
            type="button"
            className={`helpdesk-tab-btn ${activeSubTab === 'queries' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('queries'); setSubmittedTicket(null); }}
          >
            <MessageSquare size={14} />
            <span>Community Board ({queries.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="helpdesk-content-viewport">
          {/* TAB 1: HOW IT WORKS / GUIDE */}
          {activeSubTab === 'guide' && (
            <div className="helpdesk-section fade-in-up">
              <div className="guide-hero-banner">
                <span className="guide-hero-tag">THE UNWRITTEN PHILOSOPHY</span>
                <h3>A quiet, intentional sanctuary for campus connection.</h3>
                <p>
                  UNWRITTEN is intentionally built differently: a quiet sanctuary for genuine campus connection, with no public games, no follower counts, and zero unsolicited messages.
                </p>
              </div>

              <div className="guide-features-grid">
                <div className="guide-card">
                  <div className="guide-card-icon shield">
                    <ShieldCheck size={20} />
                  </div>
                  <h4>1. Roll Number Verification</h4>
                  <p>
                    Every student must enter their official enrollment roll number (format: <code>AM.XX.XXXXXXXXXX</code>). This confirms you are an authentic peer from campus. Your roll number is completely private and never shown to anyone.
                  </p>
                </div>

                <div className="guide-card">
                  <div className="guide-card-icon handshake">
                    <HeartHandshake size={20} />
                  </div>
                  <h4>2. The Two-Way Handshake</h4>
                  <p>
                    Nobody can cold-message or spam you. When you say hello, a private chat unlocks only if the other student also accepts your request. Both people must agree.
                  </p>
                </div>

                <div className="guide-card">
                  <div className="guide-card-icon lock">
                    <LockKeyhole size={20} />
                  </div>
                  <h4>3. Private Instagram Reveal</h4>
                  <p>
                    Your personal Instagram and phone number are never exposed on your public discovery card. You can voluntarily click "Share Instagram" inside a mutual chat when you feel comfortable.
                  </p>
                </div>

                <div className="guide-card">
                  <div className="guide-card-icon sparkles">
                    <Sparkles size={20} />
                  </div>
                  <h4>4. Intentional Common Grounds</h4>
                  <p>
                    Connect over chai stalls, indie music playlists, library study corners, and late-night coding rather than superficial appearance scores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS FAQS */}
          {activeSubTab === 'faqs' && (
            <div className="helpdesk-section fade-in-up">
              <div className="faq-list">
                <div className="faq-item">
                  <h4>🔒 Can anyone see my roll number or private email?</h4>
                  <p>
                    <strong>No.</strong> Your enrollment roll number and email address are strictly used for campus enrollment validation. They are stored securely in isolated private records and are never displayed on public profile cards.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>👀 Who can see my profile on campus?</h4>
                  <p>
                    Only authenticated students from your campus (e.g. <code>@{collegeDomain}</code>) can see your profile card in the Discover feed. If you ever want a break, you can toggle <strong>Invisible Mode</strong> in "My Story" to disappear from discovery without losing your existing chats.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>💬 How do connection requests work?</h4>
                  <p>
                    When you click "Say Hello", you can attach a thoughtful icebreaker note (or pick one of our prompts). The student receives it in their Requests tab. They can either accept or politely pass. If accepted, an end-to-end private chat opens immediately.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>🛡️ What if someone is behaving inappropriately?</h4>
                  <p>
                    You have total control. Inside any chat, you can click "Unmatch" at any time. This permanently removes the connection and blocks further messaging. You can also report safety concerns directly to this Help Desk.
                  </p>
                </div>

                <div className="faq-item">
                  <h4>💡 Can we suggest new hangout spots or passion categories?</h4>
                  <p>
                    Yes! Switch to the <strong>"Submit Request & Ideas"</strong> tab right here and tell us your favorite campus spots or ideas. We review student suggestions and update the platform regularly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT QUERY / REQUEST / SUGGESTION */}
          {activeSubTab === 'submit' && (
            <div className="helpdesk-section fade-in-up">
              {submittedTicket ? (
                <div className="submission-success-card">
                  <div className="success-icon">
                    <CheckCircle2 size={44} color="#55e08b" />
                  </div>
                  <h3>Request Received! ✨</h3>
                  <p className="ticket-id-line">Ticket Reference: <code>#{submittedTicket.id}</code></p>
                  <p className="success-text">
                    Thank you for shaping UNWRITTEN! Your query/suggestion has been submitted to the Campus Desk. We review student input constantly to deploy updates.
                  </p>
                  <div className="success-actions">
                    <button
                      className="primary-btn"
                      onClick={() => setSubmittedTicket(null)}
                    >
                      Submit Another Idea or Query
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => setActiveSubTab('queries')}
                    >
                      View Community Board
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="helpdesk-form">
                  <div className="form-intro">
                    <h4>Have a query, feature idea, or campus spot suggestion?</h4>
                    <p>We read every student note and roll out continuous updates based on your feedback.</p>
                  </div>

                  {/* Category Picker */}
                  <div className="input-group">
                    <label>What would you like to share?</label>
                    <div className="category-pill-row">
                      {[
                        { id: 'feature', label: '💡 Feature Request / Idea' },
                        { id: 'query', label: '❓ Question / Query' },
                        { id: 'bug', label: '🐛 Bug / Issue Report' },
                        { id: 'safety', label: '🛡️ Safety & Privacy Concern' },
                        { id: 'general', label: '💬 Campus Suggestion' }
                      ].map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          className={`category-pill ${category === cat.id ? 'active' : ''}`}
                          onClick={() => setCategory(cat.id as HelpDeskCategory)}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="input-group">
                    <label>Your Message / Suggestion Details *</label>
                    <textarea
                      rows={4}
                      className="helpdesk-textarea"
                      placeholder="Share your thought, describe a feature you'd love, or explain your query in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="anonymous-toggle-box">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <span>Submit Anonymously 🙈 (No name attached)</span>
                    </label>
                  </div>

                  {/* Optional Name & Email (if not anonymous) */}
                  {!isAnonymous && (
                    <div className="form-two-cols">
                      <div className="input-group">
                        <label>Your Name (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Fellow Student"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label>Your Email (Optional, if you'd like a response)</label>
                        <input
                          type="email"
                          placeholder="your_roll@am.students.amrita.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-submit-row">
                    <button type="submit" className="primary-btn submit-helpdesk-btn">
                      <Send size={15} />
                      <span>Submit to Campus Help Desk</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: COMMUNITY BOARD / MY QUERIES */}
          {activeSubTab === 'queries' && (
            <div className="helpdesk-section fade-in-up">
              <div className="queries-header">
                <h4>Recent Campus Queries & Requests</h4>
                <p>Track community ideas and updates being considered for UNWRITTEN.</p>
              </div>

              <div className="queries-list">
                {queries.map((q) => (
                  <div className="query-card" key={q.id}>
                    <div className="query-card-top">
                      <span className={`query-cat-badge ${q.category}`}>
                        {q.category === 'feature' ? '💡 Feature Idea' :
                         q.category === 'bug' ? '🐛 Bug Report' :
                         q.category === 'safety' ? '🛡️ Safety Concern' :
                         q.category === 'query' ? '❓ Question' : '💬 Suggestion'}
                      </span>
                      <span className="query-status-badge">
                        {q.status === 'Resolved' ? '✓ Resolved' : '● Received'}
                      </span>
                    </div>

                    <p className="query-message">"{q.message}"</p>

                    <div className="query-meta">
                      <span>Submitted by {q.name}</span>
                      <span className="dot-sep">·</span>
                      <span>{q.timestamp}</span>
                      <span className="dot-sep">·</span>
                      <span className="ticket-id">#{q.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
