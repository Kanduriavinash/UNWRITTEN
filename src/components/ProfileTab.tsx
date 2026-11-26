import React, { useState, useRef, useEffect } from 'react';
import { UserRound, LockKeyhole, EyeOff, Eye, Check, ShieldCheck, Upload, UserCheck, Smartphone, Bell, Download } from 'lucide-react';
import type { CurrentUserProfile } from '../types';
import { INTEREST_TAGS } from '../data/mockData';
import { VerifiedBadge } from './VerifiedBadge';
import { notificationManager } from '../lib/notifications';

interface ProfileTabProps {
  user: CurrentUserProfile;
  onUpdateUser: (updated: CurrentUserProfile) => void;
  onOpenAuth: () => void;
  onOpenInstall?: () => void;
  onOpenNotifications?: () => void;
  isStandaloneApp?: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onUpdateUser,
  onOpenAuth,
  onOpenInstall,
  onOpenNotifications,
  isStandaloneApp = false
}) => {
  const [formData, setFormData] = useState<CurrentUserProfile>({ ...user });
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isTestingAlert, setIsTestingAlert] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPermission(notificationManager.getPermission());
  }, []);

  const availableTags = INTEREST_TAGS.filter((t) => t !== 'All');

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const updated = {
        ...formData,
        idCardImage: result,
        isIdVerified: true
      };
      setFormData(updated);
      onUpdateUser(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTag = (tag: string) => {
    if (formData.interests.includes(tag)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((t) => t !== tag)
      });
    } else {
      if (formData.interests.length >= 8) return;
      setFormData({
        ...formData,
        interests: [...formData.interests, tag]
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <div className="eyebrow">YOUR CAMPUS IDENTITY</div>
        <h2>My Story & <em>Privacy.</em></h2>
        <p className="tab-subtitle">
          Control what fellow students can see, update your interests, and manage your privacy.
        </p>
      </div>

      <div className="profile-layout-grid">
        {/* Left: Edit Form */}
        <div className="profile-form-pane">
          <form onSubmit={handleSave} className="profile-editor-card">
            <div className="form-card-header">
              <span className="profile-card-icon">
                <UserRound size={20} />
              </span>
              <div>
                <h3>Edit Profile Details</h3>
                <span className="form-sub">Visible to eligible campus students</span>
              </div>
            </div>

            <div className="input-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                maxLength={40}
              />
              <span className="input-hint">Your first name or chosen campus nickname.</span>
            </div>

            <div className="input-group">
              <label>Study Year</label>
              <div className="custom-pill-selector" role="radiogroup" aria-label="Study Year">
                {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'].map((yr) => (
                  <button
                    type="button"
                    key={yr}
                    className={`custom-pill-opt ${formData.studyYear === yr ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, studyYear: yr })}
                  >
                    {formData.studyYear === yr && <span className="pill-dot">✦</span>}
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>What are you open to on campus?</label>
              <div className="custom-intent-cards-row" role="radiogroup" aria-label="Campus Intent">
                {[
                  { val: 'both' as const, label: 'Friendship & More', desc: 'Open to kindred spirits & seeing what blooms naturally' },
                  { val: 'friendship' as const, label: 'Friendships Only', desc: 'Study partners, canteen chai & creative projects' },
                  { val: 'dating' as const, label: 'Meaningful Spark', desc: 'A quiet, genuine connection with someone special' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.val}
                    className={`custom-intent-card ${formData.seeking === opt.val ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, seeking: opt.val })}
                  >
                    <div className="intent-card-header">
                      <span className="intent-card-title">{opt.label}</span>
                      {formData.seeking === opt.val && <span className="intent-check">✓</span>}
                    </div>
                    <p className="intent-card-desc">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>Department / Major</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. Computer Science, Architecture, Literature..."
                required
              />
            </div>

            <div className="input-group">
              <label>A Little Story Note / Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="What are you currently passionate about or listening to?"
                maxLength={250}
              />
              <span className="input-hint">{formData.bio.length}/250 characters</span>
            </div>

            <div className="input-group">
              <label>Your Interests (Tap to add/remove)</label>
              <div className="interests-picker">
                {availableTags.map((tag) => {
                  const isSelected = formData.interests.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      className={`picker-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <span className="input-hint">Select up to 8 interests for match suggestions.</span>
            </div>

            <div className="input-group private-group roll-verified-box">
              <div className="private-label-row">
                <label className="private-label">
                  <ShieldCheck size={14} color="#55e08b" /> Verified Student Roll Number
                </label>
                <span className="verified-pill">✓ Campus Verified</span>
              </div>
              <div className="roll-display-val">
                <code>{formData.rollNumber || user.rollNumber || 'AM.EN.U4CSE21001'}</code>
              </div>
              <span className="input-hint highlight-hint">
                🔒 Strictly private. Used solely for campus identity validation. Your details will not be shared anywhere.
              </span>
            </div>

            {/* College ID Card Upload & Verified Badge */}
            <div className="input-group private-group id-card-manage-group">
              <div className="private-label-row">
                <label className="private-label">
                  <UserCheck size={14} color="#55e08b" /> College ID Card Verification
                </label>
                {formData.isIdVerified ? (
                  <VerifiedBadge size={14} showLabel={true} />
                ) : (
                  <span className="unverified-pill">Pending ID Upload</span>
                )}
              </div>
              <div className="id-tab-uploader">
                {formData.idCardImage ? (
                  <div className="id-uploaded-preview">
                    <img src={formData.idCardImage} alt="College ID Card" className="id-preview-thumb" />
                    <div className="id-preview-meta">
                      <span className="id-verified-tick-note">
                        <Check size={13} /> Official ID Attached · Verified Student
                      </span>
                      <button
                        type="button"
                        className="change-id-btn"
                        onClick={() => profileFileInputRef.current?.click()}
                      >
                        Change ID Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-id-btn"
                    onClick={() => profileFileInputRef.current?.click()}
                  >
                    <Upload size={15} />
                    <span>Upload Student ID Card for Verified Badge</span>
                  </button>
                )}
                <input
                  type="file"
                  ref={profileFileInputRef}
                  accept="image/*"
                  onChange={handleIdCardUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <span className="input-hint highlight-hint">
                Earns the exclusive White Tick on Black Circle badge on your campus handle.
              </span>
            </div>

            <div className="input-group private-group">
              <label className="private-label">
                <LockKeyhole size={14} /> Private Instagram Handle (Optional)
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                placeholder="@username"
              />
              <span className="input-hint highlight-hint">
                🔒 Strictly private. Never shown on your public profile. Only shared when you explicitly click "Share Instagram" inside a mutual chat.
              </span>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="primary-btn">
                <Check size={16} /> Save Profile Changes
              </button>
              {isSavedAlert && <span className="saved-indicator">Saved successfully!</span>}
            </div>
          </form>
        </div>

        {/* Right: Privacy Controls, Mobile App & Campus Info */}
        <div className="profile-side-pane">
          {/* Mobile App & Push Notifications Card */}
          <div className="privacy-feature-card app-hub-card">
            <div className="privacy-card-header">
              <div className="privacy-icon-wrap">
                <Smartphone size={22} color="#c084fc" />
              </div>
              <div>
                <h3>UNWRITTEN Mobile App</h3>
                <span className="feature-sub">Download to phone & manage live updates</span>
              </div>
            </div>

            <p className="privacy-desc">
              Experience UNWRITTEN in native standalone mode on your Android or iPhone with zero browser address bars, offline access, and instant update chimes.
            </p>

            <div className="app-hub-actions-grid">
              <div className="app-hub-item">
                <div className="hub-status-row">
                  <span className="hub-label">Phone App:</span>
                  {isStandaloneApp ? (
                    <span className="hub-tag active"><Check size={11} /> Installed</span>
                  ) : (
                    <span className="hub-tag pending">Ready to Install</span>
                  )}
                </div>
                {!isStandaloneApp && onOpenInstall && (
                  <button
                    type="button"
                    className="hub-btn primary"
                    onClick={onOpenInstall}
                  >
                    <Download size={14} /> Install on Mobile 📲
                  </button>
                )}
              </div>

              <div className="app-hub-item">
                <div className="hub-status-row">
                  <span className="hub-label">Push Alerts:</span>
                  {permission === 'granted' ? (
                    <span className="hub-tag active"><Check size={11} /> Active</span>
                  ) : permission === 'denied' ? (
                    <span className="hub-tag muted">Blocked in Settings</span>
                  ) : (
                    <span className="hub-tag pending">Not Enabled</span>
                  )}
                </div>
                <div className="hub-btn-row">
                  {permission !== 'granted' ? (
                    <button
                      type="button"
                      className="hub-btn"
                      onClick={async () => {
                        const res = await notificationManager.requestPermission();
                        setPermission(res);
                      }}
                    >
                      <Bell size={13} /> Enable Alerts 🔔
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="hub-btn"
                      onClick={() => onOpenNotifications && onOpenNotifications()}
                    >
                      <Bell size={13} /> View Notifications
                    </button>
                  )}
                  <button
                    type="button"
                    className="hub-btn secondary"
                    disabled={isTestingAlert}
                    onClick={async () => {
                      setIsTestingAlert(true);
                      await notificationManager.sendTestNotification();
                      setTimeout(() => setIsTestingAlert(false), 1200);
                    }}
                    title="Send a sample notification chime & system banner"
                  >
                    {isTestingAlert ? 'Chiming...' : 'Test Alert 🧪'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Invisible Mode Card */}
          <div className="privacy-feature-card">
            <div className="privacy-card-header">
              <div className="privacy-icon-wrap">
                {formData.isInvisible ? <EyeOff size={22} color="#9870b0" /> : <Eye size={22} color="#7652a0" />}
              </div>
              <div>
                <h3>Invisible Mode</h3>
                <span className="feature-sub">Take a quiet break from campus discovery</span>
              </div>
            </div>

            <p className="privacy-desc">
              When Invisible Mode is enabled, your profile is hidden from the campus Discover feed so no new students can discover you. All your existing chats and matches stay completely active.
            </p>

            <div className="toggle-row">
              <label className="switch-control">
                <input
                  type="checkbox"
                  checked={formData.isInvisible}
                  onChange={(e) => {
                    const updated = { ...formData, isInvisible: e.target.checked };
                    setFormData(updated);
                    onUpdateUser(updated);
                  }}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-status-text">
                {formData.isInvisible ? (
                  <strong className="status-off">Profile Hidden (Invisible)</strong>
                ) : (
                  <strong className="status-on">Profile Visible in Campus Feed</strong>
                )}
              </span>
            </div>
          </div>

          {/* Privacy Rules Breakdown */}
          <div className="privacy-rules-card">
            <div className="rules-header">
              <ShieldCheck size={20} color="#7652a0" />
              <h3>The UNWRITTEN Privacy Promise</h3>
            </div>

            <ul className="rules-list">
              <li>
                <span className="rule-badge visible">Visible</span>
                <div>
                  <strong>Display Name, Study Year, Major, Interests & Bio</strong>
                  <p>Visible to verified campus students in the Discover feed.</p>
                </div>
              </li>
              <li>
                <span className="rule-badge private">Protected</span>
                <div>
                  <strong>College Email & Student ID</strong>
                  <p>Used strictly for verification. Never shown to any other student.</p>
                </div>
              </li>
              <li>
                <span className="rule-badge voluntary">Permission</span>
                <div>
                  <strong>Instagram Handle & Personal Contacts</strong>
                  <p>Never public. Shared only if you deliberately tap "Share Instagram" inside a match chat.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Account & Backend info */}
          <div className="account-info-card">
            <h4>College Account Status</h4>
            <p>Signed in as: <strong>{user.email}</strong></p>
            <p>Institution Domain: <strong>@{user.collegeDomain}</strong></p>
            <button className="auth-settings-btn" onClick={onOpenAuth}>
              Supabase Backend / Account Settings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
