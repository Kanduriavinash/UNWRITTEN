import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { LockKeyhole, Mail, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { validateRollNumber } from '../lib/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeDomain: string;
  onUpdateCollegeDomain: (domain: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  collegeDomain,
  onUpdateCollegeDomain
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState(collegeDomain);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Check college domain client-side as well
    if (collegeDomain && !cleanEmail.endsWith(`@${collegeDomain}`) && !cleanEmail.endsWith(`.${collegeDomain}`)) {
      setMessage(`Registration is restricted to official student emails ending in @${collegeDomain}.`);
      setMessageType('error');
      return;
    }

    // Strict Roll Number Verification for new student registration
    if (mode === 'signup') {
      const rollCheck = validateRollNumber(rollNumber);
      if (!rollCheck.isValid) {
        setMessage(rollCheck.errorMessage || 'Invalid roll number format. Must be AM.XX.XXXXXXXXXX');
        setMessageType('error');
        return;
      }
    }

    if (!supabase) {
      setMessage(`Demo Mode: Simulated sign in with ${cleanEmail}. To enable real emails, connect Supabase in .env!`);
      setMessageType('success');
      setUserEmail(cleanEmail);
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        setMessage('Verification email sent! Please check your official college inbox before signing in.');
        setMessageType('success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        setMessage('Signed in successfully.');
        setMessageType('success');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      setMessageType('error');
    } finally {
      setBusy(false);
    }
  };

  const handleDomainSave = () => {
    const clean = domainInput.trim().toLowerCase().replace(/^@/, '');
    if (clean) {
      onUpdateCollegeDomain(clean);
      setMessage(`College domain allowlist set to @${clean}`);
      setMessageType('info');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="story-modal-card auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="hello-modal-header">
          <span className="hello-modal-icon">
            <LockKeyhole size={20} />
          </span>
          <div>
            <h3>Campus Authentication</h3>
            <p className="modal-sub">
              {isSupabaseConfigured ? 'Connected to live Supabase backend' : 'Interactive Campus Sandbox Mode'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="hello-modal-body">
          {/* College Domain Allowlist Section */}
          <div className="domain-config-banner">
            <div className="domain-banner-head">
              <ShieldCheck size={16} color="#7652a0" />
              <strong>Allowed College Domain</strong>
            </div>
            <p className="domain-desc">
              UNWRITTEN only admits students with an approved institutional email address.
            </p>
            <div className="domain-input-row">
              <span className="domain-at">@</span>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. srmist.edu.in, vit.ac.in, campus.edu"
                className="domain-field"
              />
              <button
                type="button"
                className="domain-save-btn"
                onClick={handleDomainSave}
              >
                Update
              </button>
            </div>
          </div>

          {userEmail ? (
            <div className="signed-in-box">
              <Mail size={24} color="#7652a0" />
              <div>
                <h4>Signed in with Student Email</h4>
                <p>{userEmail}</p>
              </div>
              <button
                className="secondary-btn"
                onClick={async () => {
                  if (supabase) await supabase.auth.signOut();
                  setUserEmail(null);
                  setMessage('Signed out.');
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-modal-form">
              <div className="input-group">
                <label>Official Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`your_name@${collegeDomain || 'campus.edu'}`}
                  required
                />
              </div>

              {mode === 'signup' && (
                <div className="input-group roll-input-group">
                  <label className="roll-label">
                    <ShieldCheck size={14} className="shield-sparkle" />
                    <span>Campus Roll Number (Required)</span>
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="AM.XX.XXXXXXXXXX (e.g. AM.EN.U4CSE21001)"
                    maxLength={16}
                    required
                    className="roll-number-input"
                  />
                  
                  {/* Real-time Format Feedback */}
                  {rollNumber.length > 0 && (
                    <div className="roll-feedback-row">
                      <span className={`roll-status-pill ${validateRollNumber(rollNumber).isValid ? 'valid' : 'pending'}`}>
                        {validateRollNumber(rollNumber).isValid ? '✓ Valid format (AM.XX.XXXXXXXXXX)' : `Format: AM.XX.XXXXXXXXXX (${rollNumber.length}/16)`}
                      </span>
                    </div>
                  )}

                  {/* Mandatory Privacy & Security Reassurance Text */}
                  <div className="roll-privacy-disclaimer">
                    <LockKeyhole size={13} className="lock-disclaimer-icon" />
                    <p>
                      This is just for checking whether you are from our campus or not, just for security purpose only. Your details will not be shared anywhere.
                    </p>
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Password (min 8 characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn auth-submit-btn"
                disabled={busy}
              >
                {busy ? 'Processing...' : mode === 'signup' ? 'Create Campus Account' : 'Sign In'}
              </button>

              <button
                type="button"
                className="auth-switch-text"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setMessage('');
                }}
              >
                {mode === 'signup' ? 'Already registered? Sign in instead' : "New student? Create an account"}
              </button>
            </form>
          )}

          {message && (
            <div className={`auth-alert-message ${messageType}`}>
              {messageType === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
              <span>{message}</span>
            </div>
          )}

          <div className="backend-status-hint">
            <span className="dot-status"></span>
            <span>
              {isSupabaseConfigured
                ? 'Backend connected to Supabase PostgreSQL.'
                : 'Preview Sandbox: local state active. Add VITE_SUPABASE_URL in .env to connect production Supabase.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
