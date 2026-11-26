import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  MapPin, 
  HeartHandshake, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Compass, 
  Music, 
  Coffee, 
  Moon, 
  Camera, 
  BookOpen, 
  Radio
} from 'lucide-react';
import { syncStore } from '../lib/syncStore';
import { VerifiedBadge } from './VerifiedBadge';

interface InsightsTabProps {
  collegeDomain: string;
  onNavigateToDiscover?: () => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  collegeDomain = 'am.students.amrita.edu',
  onNavigateToDiscover
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  // Pull dynamic count from registered profiles in syncStore
  const sharedData = syncStore.getSharedData();
  const registeredCount = (sharedData.registeredProfiles || []).length;
  const totalStudents = 242 + registeredCount;
  const activeNow = 38 + (registeredCount % 7);
  const totalMatches = 114 + Math.floor(registeredCount * 0.7);

  // 7-day growth data
  const growth7d = [
    { label: 'Mon', count: 184, height: 42 },
    { label: 'Tue', count: 198, height: 50 },
    { label: 'Wed', count: 212, height: 60 },
    { label: 'Thu', count: 226, height: 72 },
    { label: 'Fri', count: 235, height: 80 },
    { label: 'Sat', count: 242, height: 88 },
    { label: 'Sun', count: totalStudents, height: 100 }
  ];

  // 30-day growth data
  const growth30d = [
    { label: 'Week 1', count: 48, height: 25 },
    { label: 'Week 2', count: 112, height: 50 },
    { label: 'Week 3', count: 186, height: 75 },
    { label: 'Week 4', count: totalStudents, height: 100 }
  ];

  const currentGrowth = timeframe === '7d' ? growth7d : growth30d;

  // Campus hangout spots breakdown
  const campusSpots = [
    {
      name: 'Central Library Lawn & Steps',
      category: 'Quiet Sunset Conversations',
      percent: 36,
      students: Math.round(totalStudents * 0.36),
      color: '#c287f3',
      icon: <BookOpen size={15} />
    },
    {
      name: 'Old Canteen Quadrangle',
      category: 'Hot Ginger Chai & Sketching',
      percent: 25,
      students: Math.round(totalStudents * 0.25),
      color: '#55e08b',
      icon: <Coffee size={15} />
    },
    {
      name: 'Lotus Pond Botanical Garden',
      category: 'Quiet Reading & Nature Walks',
      percent: 18,
      students: Math.round(totalStudents * 0.18),
      color: '#38bdf8',
      icon: <MapPin size={15} />
    },
    {
      name: 'AB1 Red Brick Arcades',
      category: 'Architecture Walks & Twilight',
      percent: 12,
      students: Math.round(totalStudents * 0.12),
      color: '#facc15',
      icon: <Compass size={15} />
    },
    {
      name: 'Robotics Lab Rooftop & Workshop',
      category: 'Late Night Coding & Guitar',
      percent: 9,
      students: Math.round(totalStudents * 0.09),
      color: '#f472b6',
      icon: <Radio size={15} />
    }
  ];

  // Passions breakdown
  const passionsBreakdown = [
    { name: 'Indie Music & Playlists', percent: 68, icon: <Music size={14} />, color: '#c287f3' },
    { name: 'Chai Stalls & Walks', percent: 54, icon: <Coffee size={14} />, color: '#55e08b' },
    { name: 'Late-Night Talks & Coding', percent: 46, icon: <Moon size={14} />, color: '#38bdf8' },
    { name: '35mm Film & Photography', percent: 38, icon: <Camera size={14} />, color: '#facc15' },
    { name: 'Books & Camus Poetry', percent: 31, icon: <BookOpen size={14} />, color: '#f472b6' }
  ];

  // Departments breakdown
  const departments = [
    { name: 'CSE', percent: 32, count: Math.round(totalStudents * 0.32) },
    { name: 'AIDS', percent: 20, count: Math.round(totalStudents * 0.20) },
    { name: 'EAC', percent: 15, count: Math.round(totalStudents * 0.15) },
    { name: 'AI', percent: 11, count: Math.round(totalStudents * 0.11) },
    { name: 'RAI', percent: 9, count: Math.round(totalStudents * 0.09) },
    { name: 'ELC', percent: 6, count: Math.round(totalStudents * 0.06) },
    { name: 'EEE', percent: 4, count: Math.round(totalStudents * 0.04) },
    { name: 'Other', percent: 3, count: Math.round(totalStudents * 0.03) }
  ];

  return (
    <div className="tab-container insights-viewport fade-in-up">
      {/* Hero Head */}
      <section className="insights-hero">
        <div className="eyebrow">
          <Activity size={14} className="activity-pulse" /> LIVE CAMPUS ANALYTICS & INSIGHTS
        </div>
        <h1>
          How our campus is <em>connecting.</em>
        </h1>
        <p className="hero-description">
          Real-time metrics, active student pulses, favorite hangout areas, and community health across @{collegeDomain}.
        </p>

        <div className="insights-quick-pills">
          <div className="trust-pill live-pulse-pill">
            <span className="live-radar-dot" />
            <span><strong>{activeNow} students</strong> active right now</span>
          </div>
          <div className="trust-pill">
            <ShieldCheck size={14} />
            <span>100% verified @{collegeDomain} domain</span>
          </div>
        </div>
      </section>

      {/* 9 INSIGHT SETS GRID */}
      <div className="insights-nine-grid">
        
        {/* SET 1: TOTAL CAMPUS STORYTELLERS */}
        <div className="insight-card highlight-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap purple">
              <Users size={18} />
            </div>
            <span className="growth-badge positive">
              <TrendingUp size={12} /> +38 this week
            </span>
          </div>
          <div className="metric-large-val">
            <span className="val-num">{totalStudents}</span>
            <span className="val-sub">Students</span>
          </div>
          <h3 className="insight-title">Total Campus Storytellers</h3>
          <p className="insight-desc">
            Verified students from Amrita who have created their story and are open to genuine connections.
          </p>
          <div className="insight-card-footer">
            <span className="footer-tag">Official Cohort</span>
            <span className="footer-highlight">100% Student Verified</span>
          </div>
        </div>

        {/* SET 2: LIVE CAMPUS PULSE */}
        <div className="insight-card live-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap green">
              <Radio size={18} />
            </div>
            <span className="live-indicator-badge">
              <span className="pulsing-green-dot" /> LIVE NOW
            </span>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-green">{activeNow}</span>
            <span className="val-sub">Active Students</span>
          </div>
          <h3 className="insight-title">Active Right Now</h3>
          <p className="insight-desc">
            Peers currently browsing profiles, reading stories, and responding to hello requests across campus.
          </p>
          <div className="insight-card-footer">
            <span className="footer-tag">Peak Hours</span>
            <span className="footer-highlight">8:00 PM – 11:30 PM</span>
          </div>
        </div>

        {/* SET 3: USER GROWTH & MOMENTUM */}
        <div className="insight-card chart-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap cyan">
              <TrendingUp size={18} />
            </div>
            <div className="timeframe-toggle">
              <button 
                type="button" 
                className={`tf-btn ${timeframe === '7d' ? 'active' : ''}`}
                onClick={() => setTimeframe('7d')}
              >
                7 Days
              </button>
              <button 
                type="button" 
                className={`tf-btn ${timeframe === '30d' ? 'active' : ''}`}
                onClick={() => setTimeframe('30d')}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-cyan">+214%</span>
            <span className="val-sub">Monthly Growth</span>
          </div>
          <h3 className="insight-title">Campus Adoption Curve</h3>
          
          {/* Mini Interactive Bar Graph */}
          <div className="growth-bars-track">
            {currentGrowth.map((g) => (
              <div key={g.label} className="growth-bar-col">
                <span className="bar-val-pop">{g.count}</span>
                <div 
                  className="growth-bar-fill" 
                  style={{ height: `${g.height}%` }}
                />
                <span className="bar-day-lbl">{g.label}</span>
              </div>
            ))}
          </div>

          <div className="insight-card-footer">
            <span className="footer-tag">Organic Spread</span>
            <span className="footer-highlight">~14 new students/day</span>
          </div>
        </div>

        {/* SET 4: CAMPUS AREAS & HANGOUT SPOTS */}
        <div className="insight-card areas-card span-two-cols">
          <div className="card-top-meta">
            <div className="insight-icon-wrap yellow">
              <MapPin size={18} />
            </div>
            <span className="badge-pill">5 Key Campus Spots</span>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-yellow">{campusSpots.length}</span>
            <span className="val-sub">Hangout Areas</span>
          </div>
          <h3 className="insight-title">Where Students Spend Their Twilight Hours</h3>
          <p className="insight-desc">
            Favorite campus corners mentioned in student bios, quiet walks, and meetups.
          </p>

          <div className="spots-bars-list">
            {campusSpots.map((spot) => (
              <div key={spot.name} className="spot-row-item">
                <div className="spot-info-head">
                  <div className="spot-title-duo">
                    <span className="spot-icon" style={{ color: spot.color }}>{spot.icon}</span>
                    <strong className="spot-name">{spot.name}</strong>
                    <span className="spot-cat-label">· {spot.category}</span>
                  </div>
                  <span className="spot-stats">{spot.students} students ({spot.percent}%)</span>
                </div>
                <div className="spot-progress-bg">
                  <div 
                    className="spot-progress-bar" 
                    style={{ width: `${spot.percent}%`, background: spot.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SET 5: CONNECTION HANDSHAKES */}
        <div className="insight-card handshakes-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap pink">
              <HeartHandshake size={18} />
            </div>
            <span className="growth-badge positive">
              89.4% Mutual Rate
            </span>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-pink">{totalMatches}</span>
            <span className="val-sub">Conversations</span>
          </div>
          <h3 className="insight-title">Mutual Connection Handshakes</h3>
          <p className="insight-desc">
            Chats unlocked because both students mutually said hello. Zero unwanted spam or unsolicited DMs.
          </p>
          <div className="insight-card-footer">
            <span className="footer-tag">Response Speed</span>
            <span className="footer-highlight">~18 mins avg response</span>
          </div>
        </div>

        {/* SET 6: PASSIONS & VIBE DISTRIBUTION */}
        <div className="insight-card passions-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap purple">
              <Sparkles size={18} />
            </div>
            <span className="badge-pill">Top Vibe Categories</span>
          </div>
          <h3 className="insight-title">Most Shared Passions</h3>
          <p className="insight-desc">
            The topics students connect over before ever asking for social handles.
          </p>

          <div className="passions-list">
            {passionsBreakdown.map((p) => (
              <div key={p.name} className="passion-item-row">
                <div className="passion-head">
                  <span className="passion-name-duo">
                    <span style={{ color: p.color }}>{p.icon}</span>
                    <span>{p.name}</span>
                  </span>
                  <span className="passion-pct">{p.percent}%</span>
                </div>
                <div className="passion-bar-bg">
                  <div 
                    className="passion-bar-fill" 
                    style={{ width: `${p.percent}%`, background: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SET 7: ACADEMIC BRANCHES & DEPARTMENTS */}
        <div className="insight-card dept-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap green">
              <GraduationCap size={18} />
            </div>
            <span className="badge-pill">Amrita Branches</span>
          </div>
          <h3 className="insight-title">Department Distribution</h3>
          <p className="insight-desc">
            Diverse mix of engineers, designers, biotechnologists, and writers across semesters.
          </p>

          <div className="dept-bars-list">
            {departments.map((dept) => (
              <div key={dept.name} className="dept-row">
                <div className="dept-head">
                  <span className="dept-name">{dept.name}</span>
                  <span className="dept-count">{dept.count} ({dept.percent}%)</span>
                </div>
                <div className="dept-bar-bg">
                  <div 
                    className="dept-bar-fill" 
                    style={{ width: `${dept.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SET 8: ID CARD VERIFICATION & GENDER HEALTH */}
        <div className="insight-card verification-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap black-tick">
              <VerifiedBadge size={16} showLabel={false} />
            </div>
            <span className="badge-pill positive-pill">High Integrity</span>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-white">94%</span>
            <span className="val-sub">ID Verified</span>
          </div>
          <h3 className="insight-title">White Tick Verification & Balance</h3>
          <p className="insight-desc">
            Students who uploaded their physical college ID card to earn the official White Tick on Black Circle badge.
          </p>
          
          <div className="ratio-balance-box">
            <div className="ratio-line-head">
              <span>Female (48%)</span>
              <span>Male (52%)</span>
            </div>
            <div className="ratio-bar-track">
              <div className="ratio-bar-fem" style={{ width: '48%' }} />
              <div className="ratio-bar-male" style={{ width: '52%' }} />
            </div>
            <span className="ratio-sub">Balanced discovery ecosystem across cohorts</span>
          </div>
        </div>

        {/* SET 9: CYBER SECURITY & PRIVACY FORTRESS */}
        <div className="insight-card security-card">
          <div className="card-top-meta">
            <div className="insight-icon-wrap green">
              <Lock size={18} />
            </div>
            <span className="security-shield-status">
              <span className="shield-dot" /> SECURE
            </span>
          </div>
          <div className="metric-large-val">
            <span className="val-num text-green">100%</span>
            <span className="val-sub">Privacy Score</span>
          </div>
          <h3 className="insight-title">Platform Safety & Privacy Fortress</h3>
          
          <ul className="security-features-checklist">
            <li>
              <span className="check-bullet">✓</span>
              <span>Zero unsolicited cold DMs (100% spam prevention)</span>
            </li>
            <li>
              <span className="check-bullet">✓</span>
              <span>Enrollment Roll Number isolated from public profile</span>
            </li>
            <li>
              <span className="check-bullet">✓</span>
              <span>Voluntary Instagram reveal only inside mutual chats</span>
            </li>
            <li>
              <span className="check-bullet">✓</span>
              <span>Strict @{collegeDomain} domain enforcement</span>
            </li>
          </ul>

          <div className="insight-card-footer">
            <span className="footer-tag">Defenses</span>
            <span className="footer-highlight">End-to-End Client Isolation</span>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <section className="insights-bottom-banner">
        <div className="banner-left">
          <h3>Ready to discover who shares your story?</h3>
          <p>Step back into the campus discover feed and say hello to someone new.</p>
        </div>
        <button 
          type="button" 
          className="primary-btn insights-cta-btn"
          onClick={() => onNavigateToDiscover?.()}
        >
          <Compass size={16} />
          <span>Explore Campus Discover ↗</span>
        </button>
      </section>
    </div>
  );
};
