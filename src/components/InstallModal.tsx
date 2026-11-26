import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Check, Share, PlusSquare, Sparkles, Shield, Zap, Bell } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  isStandalone: boolean;
  onInstalled?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  isStandalone,
  onInstalled
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalledSuccess, setIsInstalledSuccess] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsPrompting(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalledSuccess(true);
        if (onInstalled) onInstalled();
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="install-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="install-modal-title-group">
            <div className="install-icon-badge">
              <Smartphone size={22} className="install-pulse-icon" />
            </div>
            <div>
              <h3>Install UNWRITTEN App</h3>
              <p className="modal-subtitle">Download directly to your mobile device — zero app store required</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="install-modal-body">
          {/* App Preview Card */}
          <div className="install-app-preview">
            <img src="/icons/icon-192.png" alt="UNWRITTEN App Icon" className="install-preview-icon" />
            <div className="install-preview-details">
              <h4>UNWRITTEN — Campus Sanctuary</h4>
              <span className="install-domain-tag">@am.students.amrita.edu</span>
              <div className="install-meta-tags">
                <span className="install-tag-item"><Sparkles size={11} /> PWA Standalone</span>
                <span className="install-tag-item"><Shield size={11} /> 100% Private</span>
                <span className="install-tag-item"><Zap size={11} /> Fast & Offline</span>
              </div>
            </div>
          </div>

          {/* Already Installed State */}
          {isStandalone || isInstalledSuccess ? (
            <div className="install-status-box installed-success">
              <div className="success-icon-wrap">
                <Check size={24} />
              </div>
              <div className="success-text">
                <strong>UNWRITTEN is Installed on this Device!</strong>
                <p>You can launch it anytime directly from your phone home screen or app drawer with native speed and fullscreen sanctuary mode.</p>
              </div>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Visual Guide */
            <div className="ios-instructions-box">
              <div className="ios-guide-header">
                <Smartphone size={16} />
                <span>How to Install on iPhone / iPad (Safari)</span>
              </div>
              <p className="ios-guide-note">
                Apple requires installing web apps via the Safari Share menu. Follow these 3 simple steps:
              </p>

              <ol className="ios-steps-list">
                <li className="ios-step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <span className="step-title">Tap the <strong>Share</strong> button</span>
                    <span className="step-desc">
                      Tap the square icon with an upward arrow <Share size={14} className="inline-icon" /> at the bottom of your Safari screen.
                    </span>
                  </div>
                </li>
                <li className="ios-step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <span className="step-title">Select <strong>"Add to Home Screen"</strong></span>
                    <span className="step-desc">
                      Scroll down in the sharing sheet and tap the <PlusSquare size={14} className="inline-icon" /> <strong>Add to Home Screen</strong> option.
                    </span>
                  </div>
                </li>
                <li className="ios-step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <span className="step-title">Tap <strong>"Add"</strong> in the top corner</span>
                    <span className="step-desc">
                      UNWRITTEN will appear on your phone home screen with its official icon just like an App Store app!
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Desktop Chrome 1-Click Install */
            <div className="android-instructions-box">
              <p className="install-intro-text">
                Install UNWRITTEN to your phone's home screen for an uninterrupted, full-screen campus experience with zero browser address bars and instant update notifications.
              </p>

              <div className="install-perks-grid">
                <div className="perk-card">
                  <Zap size={16} className="perk-icon" />
                  <div>
                    <strong>Instant Launch</strong>
                    <span>Loads 2x faster directly from home screen.</span>
                  </div>
                </div>
                <div className="perk-card">
                  <Bell size={16} className="perk-icon" />
                  <div>
                    <strong>Live Notifications</strong>
                    <span>Instant alerts for whispers and requests.</span>
                  </div>
                </div>
                <div className="perk-card">
                  <Shield size={16} className="perk-icon" />
                  <div>
                    <strong>Private & Isolated</strong>
                    <span>Zero browser history tracking or cookies.</span>
                  </div>
                </div>
              </div>

              <div className="install-action-container">
                {deferredPrompt ? (
                  <button
                    className="primary-btn install-cta-btn"
                    onClick={handleInstallClick}
                    disabled={isPrompting}
                  >
                    <Download size={18} />
                    <span>{isPrompting ? 'Opening Prompt...' : 'Install UNWRITTEN to Home Screen 📲'}</span>
                  </button>
                ) : (
                  <div className="manual-install-tip">
                    <span>💡 Tip: If the prompt doesn't appear automatically, tap the three dots <strong>(⋮)</strong> in your Chrome menu and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer install-footer">
          <span className="free-forever-badge">100% Free · Progressive Web App</span>
          <button className="secondary-btn" onClick={onClose}>
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
