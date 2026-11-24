import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaSpeed: number;
  hue: number;
}

export const CelestialCanvas: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseRadius = Math.random() * 2 + 0.6;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: baseRadius,
        baseRadius,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.1, // Gently drift upwards like glowing dust
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: Math.random() * 0.015 + 0.005,
        hue: Math.random() > 0.5 ? 280 : 330 // Lavender to Rose
      });
    }

    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Mouse proximity glow
        if (interactive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.radius = p.baseRadius * (1 + (120 - dist) / 60);
          } else {
            p.radius = p.baseRadius;
          }
        }

        // Draw particle with soft aura
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2.5
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 75%, ${p.alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, 75%, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, [interactive]);

  return <canvas ref={canvasRef} className="celestial-canvas" />;
};
