import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, Heart, Compass, Shield, BookHeart } from 'lucide-react';
import { CelestialCanvas } from './CelestialCanvas';
import { soundscape } from '../lib/soundscapes';

interface StoryPrologueProps {
  onEnterCampus: () => void;
}

export const StoryPrologue: React.FC<StoryPrologueProps> = ({ onEnterCampus }) => {
  const [chapter, setChapter] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const totalChapters = 4;

  const handleNext = () => {
    if (chapter < totalChapters - 1) {
      const nextChapter = chapter + 1;
      setChapter(nextChapter);
      soundscape.playChapterTone(nextChapter);
    } else {
      handleEnter();
    }
  };

  const handlePrev = () => {
    if (chapter > 0) {
      setChapter(chapter - 1);
    }
  };

  const handleEnter = () => {
    soundscape.playChime(783.99); // G5 harmonic
    onEnterCampus();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const active = soundscape.toggleMute();
    setIsAudioActive(active);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapter]);

  return (
    <div className="prologue-viewport" onClick={handleNext}>
      {/* Living Celestial Canvas */}
      <CelestialCanvas interactive={true} />

      {/* Top Ambient Bar */}
      <header className="prologue-header" onClick={(e) => e.stopPropagation()}>
        <div className="prologue-brand">
          <BookHeart size={20} className="prologue-logo-icon" />
          <span>unwritten<span className="dot">.</span></span>
        </div>

        {/* Chapter Progress Indicators */}
        <div className="chapter-indicators">
          {Array.from({ length: totalChapters }).map((_, i) => (
            <button
              key={i}
              className={`chapter-step ${i === chapter ? 'active' : ''} ${i < chapter ? 'passed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setChapter(i);
                soundscape.playChapterTone(i);
              }}
              title={`Jump to Chapter ${i + 1}`}
            >
              <span className="step-num">{['I', 'II', 'III', 'IV'][i]}</span>
              <span className="step-bar" />
            </button>
          ))}
        </div>

        <div className="prologue-header-actions">
          {/* Soundscape Ambient Audio Toggle */}
          <button
            className={`sound-toggle-btn ${isAudioActive ? 'sound-on' : ''}`}
            onClick={toggleSound}
            title={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="sound-text">{isAudioActive ? 'Soundscape: On' : 'Soundscape: Off'}</span>
            {isAudioActive && (
              <span className="sound-pulse-waves">
                <span className="wave-bar w1" />
                <span className="wave-bar w2" />
                <span className="wave-bar w3" />
              </span>
            )}
          </button>

          <button className="skip-btn" onClick={handleEnter}>
            <span>Enter Campus</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Chapter Content Frame */}
      <main className="prologue-main" onClick={(e) => e.stopPropagation()}>
        {/* CHAPTER 1 */}
        {chapter === 0 && (
          <div className="chapter-frame fade-in-up">
            <div className="prologue-eyebrow">
              <Sparkles size={14} /> CHAPTER I · THE STRANGERS WE WALK PAST
            </div>
            <h1 className="prologue-title">
              Every day on campus,<br />you walk past someone who could <em>change your story.</em>
            </h1>
            <p className="prologue-lede">
              On library stairs. In crowded canteen lines. Under evening quadrangle streetlights.<br />
              Hundreds of lives moving beside yours, separated only by a silent threshold.
            </p>

            <div className="fragments-context-container">
              <span className="fragments-context-label">
                Real campus moments happening around you every day:
              </span>
              <div className="floating-fragments-row">
                <div className="fragment-pill f1">
                  <span>🎧 Someone listening to the same indie playlist in the library</span>
                </div>
                <div className="fragment-pill f2">
                  <span>☕ The familiar stranger you cross paths with at the chai stall</span>
                </div>
                <div className="fragment-pill f3">
                  <span>👀 That quiet glance across the courtyard you never acted on</span>
                </div>
              </div>
            </div>

            <div className="prologue-prompt-line">
              <button className="prologue-continue-btn" onClick={handleNext}>
                <span>Turn the page</span>
                <ArrowRight size={15} />
              </button>
              <span className="sub-hint">or press Space / tap anywhere</span>
            </div>
          </div>
        )}

        {/* CHAPTER 2 */}
        {chapter === 1 && (
          <div className="chapter-frame fade-in-up">
            <div className="prologue-eyebrow">
              <Heart size={14} /> CHAPTER II · WHY MODERN DATING FEELS EMPTY
            </div>
            <h1 className="prologue-title">
              Swiping turned human souls into <em>four-second thumbnails.</em>
            </h1>
            <p className="prologue-lede">
              Algorithms optimized for dopamine, not depth. Public follower counts. The anxiety of feeling judged before a single word is ever spoken.
            </p>

            <div className="contrast-grid">
              <div className="contrast-card traditional">
                <span className="contrast-badge">Traditional Dating Apps</span>
                <ul>
                  <li>✕ Faces judged in 0.4 seconds</li>
                  <li>✕ Public profiles exposed to anyone</li>
                  <li>✕ Pressure of performance & followers</li>
                  <li>✕ Superficial pickup lines</li>
                </ul>
              </div>

              <div className="contrast-card unwritten">
                <span className="contrast-badge glow">The UNWRITTEN Way</span>
                <ul>
                  <li>✓ Discovered through music, books & quiet passions</li>
                  <li>✓ Personal Instagram & phone stay 100% private</li>
                  <li>✓ Two mutual yeses required before speaking</li>
                  <li>✓ For genuine friendships, late-night talks, and unspoken connections</li>
                </ul>
              </div>
            </div>

            <div className="prologue-prompt-line">
              <button className="prologue-continue-btn" onClick={handleNext}>
                <span>Continue the story</span>
                <ArrowRight size={15} />
              </button>
              <span className="sub-hint">Chapter II of IV</span>
            </div>
          </div>
        )}

        {/* CHAPTER 3 */}
        {chapter === 2 && (
          <div className="chapter-frame fade-in-up">
            <div className="prologue-eyebrow">
              <Shield size={14} /> CHAPTER III · A SOFTER KIND OF CONNECTION
            </div>
            <h1 className="prologue-title">
              No pressure. No public games.<br />Just <em>two people finding each other.</em>
            </h1>
            <p className="prologue-lede">
              A private campus sanctuary for your college. Verified student emails only. Your Instagram handle is shared <em>only</em> if you deliberately choose to inside a private conversation.
            </p>

            <div className="trance-pillars">
              <div className="trance-pillar-card">
                <div className="pillar-icon">🌙</div>
                <h4>Slow Connections</h4>
                <p>No rush or expiring timers. Save profiles for quiet reflection.</p>
              </div>

              <div className="trance-pillar-card">
                <div className="pillar-icon">☕</div>
                <h4>Campus Common Grounds</h4>
                <p>Connect over chai stalls, library corners, and favorite acoustic songs.</p>
              </div>

              <div className="trance-pillar-card">
                <div className="pillar-icon">🔒</div>
                <h4>Uncompromising Privacy</h4>
                <p>Invisible Mode whenever you need a peaceful break.</p>
              </div>
            </div>

            <div className="prologue-prompt-line">
              <button className="prologue-continue-btn" onClick={handleNext}>
                <span>Step into the finale</span>
                <ArrowRight size={15} />
              </button>
              <span className="sub-hint">Chapter III of IV</span>
            </div>
          </div>
        )}

        {/* CHAPTER 4 */}
        {chapter === 3 && (
          <div className="chapter-frame fade-in-up final-chapter">
            <div className="prologue-eyebrow glowing-eyebrow">
              <Sparkles size={14} /> CHAPTER IV · YOUR STORY BEGINS
            </div>
            <h1 className="prologue-title grand-title">
              You haven't met everyone<br />who will <em>matter to you yet.</em>
            </h1>
            <p className="prologue-quote">
              “Some stories don't start with a plan. They start with an unexpected hello.”
            </p>

            <div className="portal-cta-wrap">
              <button className="enter-portal-btn pulse-glow" onClick={handleEnter}>
                <span className="portal-sparkle">✦</span>
                <span className="portal-text">Step into UNWRITTEN</span>
                <Compass size={18} className="portal-arrow" />
              </button>
              <p className="portal-footnote ready-buddy-line">
                Are you ready to write your story buddy? ✨
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Ambient Hint */}
      <footer className="prologue-footer" onClick={(e) => e.stopPropagation()}>
        <span className="prologue-tagline">UNWRITTEN · YOUR STORY. STILL UNWRITTEN.</span>
        <div className="chapter-nav-arrows">
          {chapter > 0 && (
            <button className="arrow-nav-btn" onClick={handlePrev}>← Previous</button>
          )}
          <button className="arrow-nav-btn" onClick={handleNext}>
            {chapter === totalChapters - 1 ? 'Enter Campus →' : 'Next Chapter →'}
          </button>
        </div>
      </footer>
    </div>
  );
};
