import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowUpRight, Compass } from 'lucide-react';
import type { StudentProfile } from '../types';
import { soundscape } from '../lib/soundscapes';

interface ConstellationMapProps {
  profiles: StudentProfile[];
  userInterests: string[];
  onOpenStory: (profile: StudentProfile) => void;
  onOpenHello: (profile: StudentProfile) => void;
  sentRequestIds: string[];
}

interface StarNode {
  profile: StudentProfile;
  x: number;
  y: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({
  profiles,
  userInterests,
  onOpenStory,
  onOpenHello,
  sentRequestIds
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredProfile, setHoveredProfile] = useState<StudentProfile | null>(null);
  const [selectedNode, setSelectedNode] = useState<StarNode | null>(null);
  const activeFilterInterest = 'All';
  const nodesRef = useRef<StarNode[]>([]);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize constellation nodes positioned in an aesthetic spiral/constellation
  useEffect(() => {
    const starColors = [
      { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)' },
      { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.6)' },
      { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.6)' },
      { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)' },
      { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.6)' },
      { color: '#34d399', glow: 'rgba(52, 211, 153, 0.6)' }
    ];

    const nodes: StarNode[] = profiles.map((p, index) => {
      // Golden ratio constellation distribution
      const phi = (1 + Math.sqrt(5)) / 2;
      const angle = index * (2 * Math.PI / phi);
      const radiusDist = 0.22 + (index / (profiles.length + 1)) * 0.42;

      const palette = starColors[index % starColors.length];
      return {
        profile: p,
        x: 0.5 + Math.cos(angle) * radiusDist * 0.9,
        y: 0.5 + Math.sin(angle) * radiusDist * 0.7,
        baseRadius: 6 + (p.interests.some(i => userInterests.includes(i)) ? 2.5 : 0),
        color: palette.color,
        glowColor: palette.glow,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    nodesRef.current = nodes;
  }, [profiles, userInterests]);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = 540 * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const now = performance.now() * 0.002;

      // 1. Draw Constellation Link Lines (between students with shared interests)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          // Check if they share interests
          const sharedInterests = n1.profile.interests.filter(item => n2.profile.interests.includes(item));
          const matchesFilter = activeFilterInterest === 'All' || n1.profile.interests.includes(activeFilterInterest) && n2.profile.interests.includes(activeFilterInterest);

          if (sharedInterests.length > 0 && matchesFilter) {
            const x1 = n1.x * width;
            const y1 = n1.y * height;
            const x2 = n2.x * width;
            const y2 = n2.y * height;

            const isHoveredLine = (hoveredProfile?.id === n1.profile.id || hoveredProfile?.id === n2.profile.id);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isHoveredLine
              ? 'rgba(216, 180, 254, 0.75)'
              : 'rgba(168, 85, 247, 0.16)';
            ctx.lineWidth = isHoveredLine ? 1.8 : 0.8;
            ctx.setLineDash(isHoveredLine ? [] : [3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 2. Draw Stars
      for (const node of nodes) {
        const x = node.x * width;
        const y = node.y * height;

        const isHovered = hoveredProfile?.id === node.profile.id;
        const pulse = Math.sin(now + node.pulsePhase) * 1.5;
        const currentRadius = (node.baseRadius + pulse) * (isHovered ? 1.5 : 1);

        // Outer Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 3.5);
        grad.addColorStop(0, node.glowColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, currentRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core Star
        ctx.fillStyle = isHovered ? '#ffffff' : node.color;
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = isHovered ? '600 13px DM Sans, sans-serif' : '500 11px DM Sans, sans-serif';
        ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(226, 232, 240, 0.75)';
        ctx.textAlign = 'center';
        ctx.fillText(node.profile.name, x, y + currentRadius + 14);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [hoveredProfile, activeFilterInterest]);

  // Mouse Interaction: Find node under cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    const width = rect.width;
    const height = rect.height;

    let matched: StarNode | null = null;
    for (const node of nodesRef.current) {
      const nx = node.x * width;
      const ny = node.y * height;
      const dist = Math.hypot(nx - x, ny - y);
      if (dist < 26) {
        matched = node;
        break;
      }
    }

    if (matched) {
      if (hoveredProfile?.id !== matched.profile.id) {
        soundscape.playChime(587.33); // D5 soft celestial chime
        setHoveredProfile(matched.profile);
        setSelectedNode(matched);
      }
    } else {
      setHoveredProfile(null);
    }
  };

  const handleCanvasClick = () => {
    if (selectedNode) {
      onOpenStory(selectedNode.profile);
    }
  };

  return (
    <div className="constellation-container" ref={containerRef}>
      <div className="constellation-header">
        <div className="constellation-title-group">
          <div className="eyebrow">
            <Sparkles size={13} className="spin-slow" /> CAMPUS CONSTELLATION MAP
          </div>
          <h3>Every student is a star in your college night sky.</h3>
          <p className="constellation-sub">
            Hover over stars to reveal shared passions and illuminated constellation pathways.
          </p>
        </div>

        <div className="constellation-hint-pill">
          <Compass size={13} />
          <span>Interactive Cosmic View</span>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setHoveredProfile(null); mousePosRef.current = null; }}
          onClick={handleCanvasClick}
          className="constellation-canvas"
        />

        {/* Floating Star Card when hovered */}
        {hoveredProfile && (
          <aside className="star-floating-card fade-in-up" role="region" aria-label="Student Constellation Details">
            <div className="star-card-top">
              <div
                className="star-card-avatar"
                style={{ background: hoveredProfile.avatarGradient, color: hoveredProfile.avatarColor }}
              >
                {hoveredProfile.avatarChar}
              </div>
              <div className="star-card-meta">
                <h4>{hoveredProfile.name}, {hoveredProfile.age}</h4>
                <span>{hoveredProfile.studyYear} · {hoveredProfile.course}</span>
              </div>
            </div>

            <p className="star-card-quote">“{hoveredProfile.note}”</p>

            <div className="star-card-tags">
              {hoveredProfile.interests.slice(0, 3).map((item) => (
                <span key={item} className="star-tag">{item}</span>
              ))}
            </div>

            <div className="star-card-actions">
              <button
                className="secondary-btn"
                onClick={() => onOpenStory(hoveredProfile)}
              >
                Read story
              </button>
              <button
                className="primary-btn"
                onClick={() => onOpenHello(hoveredProfile)}
                disabled={sentRequestIds.includes(hoveredProfile.id)}
              >
                {sentRequestIds.includes(hoveredProfile.id) ? (
                  <>✓ Hello sent</>
                ) : (
                  <>Say hello <ArrowUpRight size={13} /></>
                )}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
