import React, { useState, useRef } from 'react';
import { LockKeyhole, Mail, ShieldCheck, UserCheck, BookHeart, Upload, Check, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { CurrentUserProfile } from '../types';
import { validateRollNumber } from '../lib/validation';
import { INTEREST_TAGS } from '../data/mockData';
import { soundscape } from '../lib/soundscapes';
import { VerifiedBadge } from './VerifiedBadge';

interface CampusAuthViewProps {
  collegeDomain: string;
  onAuthSuccess: (user: CurrentUserProfile) => void;
  onCancel?: () => void;
}

export const CampusAuthView: React.FC<CampusAuthViewProps> = ({
  collegeDomain = 'am.students.amrita.edu',
  onAuthSuccess,
  onCancel
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState('CSE');
  const [otherCourse, setOtherCourse] = useState('');
  const [studyYear, setStudyYear] = useState('1st Year');
  const [seeking, setSeeking] = useState<'friendship' | 'dating' | 'both'>('both');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Indie Music', 'Coffee Walks', 'Late-night talks']);

  // ID Card upload
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & error messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleInterest = (tag: string) => {
    if (tag === 'All') return;
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, tag]);
      }
    }
  };

  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG) for your College ID card.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setIdCardImage(result);
      setIsIdVerified(true);
      soundscape.playChime(1046.5);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // Validate email domain
    if (!cleanEmail.endsWith(`@${collegeDomain}`) && !cleanEmail.endsWith(`.${collegeDomain}`)) {
      setErrorMsg(`Registration is strictly restricted to official student emails ending in @${collegeDomain}.`);
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your name.');
        return;
      }

      // Validate roll number format AM.XX.XXXXXXXXXX
      const rollCheck = validateRollNumber(rollNumber);
      if (!rollCheck.isValid) {
        setErrorMsg(rollCheck.errorMessage || 'Invalid roll number format. Must be AM.XX.XXXXXXXXXX');
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    setBusy(true);

    const finalCourse = course === 'Other' ? (otherCourse.trim() || 'Other') : course;

    // Generate unique, deterministic campus student ID based on institutional email
    const studentUid = cleanEmail
      ? `stu_${cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      : `stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const userProfile: CurrentUserProfile = {
      id: studentUid,
      displayName: fullName.trim() || 'Campus Student',
      email: cleanEmail,
      isVerified: true,
      collegeDomain,
      gender,
      course: finalCourse,
      studyYear,
      bio: bio.trim() || 'Excited to meet like-minded peers across campus.',
      interests: selectedInterests.length > 0 ? selectedInterests : ['Indie Music', 'Coffee Walks'],
      seeking,
      isInvisible: false,
      instagramHandle: '',
      rollNumber: rollNumber.trim().toUpperCase(),
      isIdVerified,
      idCardImage: idCardImage || undefined,
      isAuthenticated: true
    };

    setTimeout(() => {
      setBusy(false);
      soundscape.playChime(880);
      onAuthSuccess(userProfile);
    }, 400);
  };

  return (
    <div className="campus-auth-fullscreen">
      <div className="auth-container-card fade-in-up">
        {/* Brand & Eyebrow */}
        <div className="auth-brand-head">
          <div className="auth-brand-logo">
            <BookHeart size={24} className="auth-logo-icon" />
            <span className="auth-brand-text">unwritten<span className="dot">.</span></span>
          </div>
          <span className="auth-campus-badge">
            <ShieldCheck size={13} />
            <span>@{collegeDomain} Only</span>
          </span>
        </div>

        <div className="auth-headings">
          <h2>{mode === 'signup' ? 'Create Your Campus Story' : 'Welcome Back'}</h2>
          <p className="auth-sublede">
            {mode === 'signup'
              ? 'An authentic, slow-paced sanctuary for genuine campus connections.'
              : 'Sign in to see incoming connection requests and private chats.'}
          </p>
        </div>

        {/* Tab Toggle: Sign Up vs Sign In */}
        <div className="auth-mode-toggle">
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
          >
            New Student (Sign Up)
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
          >
            Existing Member (Sign In)
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error-banner fade-in-up">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          {mode === 'signup' && (
            <>
              {/* Full Name & Gender Selection */}
              <div className="form-row-duo">
                <div className="input-group">
                  <label>Full Name / Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Gender * (Determines Discovery Matching)</label>
                  <div className="gender-selector-row">
                    <button
                      type="button"
                      className={`gender-choice-btn ${gender === 'male' ? 'active' : ''}`}
                      onClick={() => setGender('male')}
                    >
                      <span>Male ♂</span>
                    </button>
                    <button
                      type="button"
                      className={`gender-choice-btn ${gender === 'female' ? 'active' : ''}`}
                      onClick={() => setGender('female')}
                    >
                      <span>Female ♀</span>
                    </button>
                  </div>
                  <span className="gender-hint">
                    {gender === 'male'
                      ? '✦ As a male student, you will discover female peers.'
                      : '✦ As a female student, you will discover male peers.'}
                  </span>
                </div>
              </div>

              {/* Official Email */}
              <div className="input-group">
                <label>Official Amrita Student Email *</label>
                <div className="email-input-wrapper">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    required
                    placeholder={`your_roll@${collegeDomain}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Roll Number with Validation & Privacy Disclaimer */}
              <div className="input-group roll-number-group">
                <label className="roll-label">
                  <ShieldCheck size={14} className="roll-icon" />
                  <span>Campus Roll Number (Required Format: AM.XX.XXXXXXXXXX) *</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="AM.EN.U4CSE21001"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  className="roll-number-input"
                />

                {rollNumber.length > 0 && (
                  <div className="roll-validation-pill">
                    <span className={validateRollNumber(rollNumber).isValid ? 'valid' : 'invalid'}>
                      {validateRollNumber(rollNumber).isValid
                        ? '✓ Valid format (AM.XX.XXXXXXXXXX)'
                        : `Format: AM.XX.XXXXXXXXXX (${rollNumber.length}/16)`}
                    </span>
                  </div>
                )}

                {/* Mandatory Privacy Disclaimer */}
                <div className="roll-privacy-disclaimer">
                  <LockKeyhole size={13} className="privacy-lock-icon" />
                  <p>
                    This is just for checking whether you are from our campus or not, just for security purpose only. Your details will not be shared anywhere.
                  </p>
                </div>
              </div>

              {/* Course & Study Year */}
              <div className="form-row-duo">
                <div className="input-group">
                  <label>Department / Branch</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="auth-select"
                  >
                    <option value="CSE">CSE</option>
                    <option value="AIDS">AIDS</option>
                    <option value="AI">AI</option>
                    <option value="RAI">RAI</option>
                    <option value="ELC">ELC</option>
                    <option value="EAC">EAC</option>
                    <option value="EEE">EEE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Study Year</label>
                  <select
                    value={studyYear}
                    onChange={(e) => setStudyYear(e.target.value)}
                    className="auth-select"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Mention other department if 'Other' selected */}
              {course === 'Other' && (
                <div className="input-group other-dept-group">
                  <label>Mention Your Department / Course</label>
                  <input
                    type="text"
                    placeholder="Mention your department (e.g. Mechanical, Biotech, MBA, Aerospace...)"
                    value={otherCourse}
                    onChange={(e) => setOtherCourse(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>
              )}

              {/* Seeking Intent */}
              <div className="input-group">
                <label>What are you open to?</label>
                <div className="seeking-intent-row">
                  {(['both', 'dating', 'friendship'] as const).map((intent) => (
                    <button
                      key={intent}
                      type="button"
                      className={`intent-pill-btn ${seeking === intent ? 'active' : ''}`}
                      onClick={() => setSeeking(intent)}
                    >
                      {intent === 'both' ? 'Both (Dating & Friendship)' : intent === 'dating' ? 'Dating' : 'Friendship'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio / Story Note */}
              <div className="input-group">
                <label>A Little Story Note / Bio</label>
                <textarea
                  rows={2}
                  placeholder="What is your favorite quiet corner or playlist on campus?"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                />
              </div>

              {/* Interests Tags */}
              <div className="input-group">
                <label>Choose your passions / interests (Pick up to 6)</label>
                <div className="auth-interests-chips">
                  {INTEREST_TAGS.filter((t) => t !== 'All').map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`interest-chip-btn ${selectedInterests.includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleInterest(tag)}
                    >
                      {selectedInterests.includes(tag) ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* College ID Card Upload Section (Verified Tick) */}
              <div className="id-card-upload-box">
                <div className="id-box-head">
                  <div className="id-box-title">
                    <UserCheck size={16} className="id-check-icon" />
                    <strong>College ID Card Verification</strong>
                    <VerifiedBadge size={14} showLabel={false} />
                  </div>
                  <span className="id-box-sub">Earn the official White Tick on Black Circle badge on your handle</span>
                </div>

                <div className="id-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleIdFileUpload}
                    style={{ display: 'none' }}
                  />

                  {idCardImage ? (
                    <div className="id-preview-frame">
                      <img src={idCardImage} alt="Uploaded College ID" className="id-thumb-img" />
                      <div className="id-verified-status">
                        <span className="status-badge-verified">
                          <Check size={14} /> ID Attached · Verified Student
                        </span>
                        <span className="re-upload-text">Click to change image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="id-placeholder-content">
                      <Upload size={22} className="upload-arrow-icon" />
                      <p>Click or tap to upload photo of your College ID Card</p>
                      <span className="upload-format-hint">JPG, PNG · Kept private for campus security only</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password (min 6 characters) *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'signin' && (
            <>
              <div className="input-group">
                <label>Official Amrita Student Email *</label>
                <div className="email-input-wrapper">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    required
                    placeholder={`your_roll@${collegeDomain}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="auth-submit-row">
            <button
              type="submit"
              disabled={busy}
              className="primary-btn auth-main-submit"
            >
              {busy ? (
                <span>Entering Campus...</span>
              ) : mode === 'signup' ? (
                <>
                  <span>Join UNWRITTEN Campus</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Sign In & Enter</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                className="secondary-btn auth-cancel-btn"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
