const fs = require('fs');
const path = require('path');

const userUploadedPath = 'C:/Users/kandu/.gemini/antigravity/brain/7c0e4eed-9dba-4e58-a89b-4392abd073f7/.user_uploaded/media_1795676441297_5a8d8268.png';
const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Copy original uploaded image as logo.png
if (fs.existsSync(userUploadedPath)) {
  fs.copyFileSync(userUploadedPath, path.join(publicDir, 'logo.png'));
  fs.copyFileSync(userUploadedPath, path.join(iconsDir, 'user-logo.png'));
  console.log('Copied user logo to public/logo.png and public/icons/user-logo.png');
}

// 2. Generate Master SVG Vector of the BookHeart Logo
// ViewBox is 512x512. Lucide BookHeart is 24x24.
// Centering: 24 * 14 = 336. Offset = (512 - 336) / 2 = 88.
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Midnight celestial background -->
    <radialGradient id="bgGrad" cx="50%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#22103a"/>
      <stop offset="55%" stop-color="#120720"/>
      <stop offset="100%" stop-color="#0b0512"/>
    </radialGradient>

    <!-- Radiant lilac glow -->
    <radialGradient id="haloGlow" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.35"/>
      <stop offset="65%" stop-color="#a855f7" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0b0512" stop-opacity="0"/>
    </radialGradient>

    <!-- Soft lilac linear gradient for book stroke -->
    <linearGradient id="bookStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="35%" stop-color="#e9d5ff"/>
      <stop offset="70%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>

    <!-- Heart accent gradient -->
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="40%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base for App Icon -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="rgba(192, 132, 252, 0.22)" stroke-width="3"/>

  <!-- Celestial Halo -->
  <circle cx="256" cy="256" r="200" fill="url(#haloGlow)"/>

  <!-- BookHeart Official Glyph -->
  <g transform="translate(88, 88) scale(14)" filter="url(#softGlow)">
    <!-- Book Outline & Bottom Spine -->
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="none"
      stroke="url(#bookStroke)"
      stroke-width="2.1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Heart Motif -->
    <path
      d="M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7"
      fill="none"
      stroke="url(#heartGrad)"
      stroke-width="2.1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), masterSvg);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg);
console.log('Created public/icons/icon.svg and public/favicon.svg');
