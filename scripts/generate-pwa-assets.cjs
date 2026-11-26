const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Generate SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#24113a"/>
      <stop offset="50%" stop-color="#140822"/>
      <stop offset="100%" stop-color="#0b0512"/>
    </radialGradient>
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#818cf8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0b0512" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="35%" stop-color="#e879f9"/>
      <stop offset="70%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="rgba(192, 132, 252, 0.25)" stroke-width="4" />

  <!-- Ambient Glow -->
  <circle cx="256" cy="256" r="210" fill="url(#glowGrad)"/>

  <!-- Celestial Constellation Ring -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="rgba(192, 132, 252, 0.2)" stroke-width="2" stroke-dasharray="6 8"/>
  <circle cx="256" cy="256" r="125" fill="none" stroke="rgba(168, 85, 247, 0.3)" stroke-width="1.5"/>

  <!-- Orbital Constellation Nodes -->
  <circle cx="256" cy="96" r="4.5" fill="#fdf4ff"/>
  <circle cx="416" cy="256" r="4.5" fill="#fdf4ff"/>
  <circle cx="256" cy="416" r="4.5" fill="#fdf4ff"/>
  <circle cx="96" cy="256" r="4.5" fill="#fdf4ff"/>

  <!-- Central Celestial Book & Heart Motif -->
  <g filter="url(#glow)" transform="translate(0, -6)">
    <!-- Heart & Story Arc -->
    <path d="M 256 160 C 220 110, 140 130, 150 205 C 158 260, 220 310, 256 345 C 292 310, 354 260, 362 205 C 372 130, 292 110, 256 160 Z"
          fill="none" stroke="url(#goldGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Open Sanctuary Leaves / Pages -->
    <path d="M 185 245 Q 220 280 256 280 Q 292 280 327 245"
          fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="8" stroke-linecap="round"/>

    <!-- Central 8-Point Compass Star -->
    <g transform="translate(256, 215)">
      <!-- Vertical & Horizontal Rays -->
      <polygon points="0,-48 6,-12 48,0 6,12 0,48 -6,12 -48,0 -6,-12" fill="#ffffff"/>
      <!-- Diagonal Rays -->
      <polygon points="0,-28 4,-8 28,0 4,8 0,28 -4,8 -28,0 -4,-8" fill="#f5d0fe" transform="rotate(45)"/>
      <circle cx="0" cy="0" r="5" fill="#a855f7"/>
    </g>
  </g>

  <!-- Wordmark Lettering -->
  <text x="256" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="34" font-weight="700" letter-spacing="6" fill="#fdf4ff" text-anchor="middle" opacity="0.95">
    UNWRITTEN
  </text>
  <circle cx="370" cy="412" r="4" fill="#e879f9" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
console.log('Created public/icons/icon.svg');

// 2. Helper to build raw PNG using Node zlib
function createPng(size, filename) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc((width * 4 + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width / 2;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / maxR;

      // Base background gradient: #24113a in center to #0b0512 at edge
      let r = Math.round(36 * (1 - normDist * 0.7) + 11 * (normDist * 0.7));
      let g = Math.round(17 * (1 - normDist * 0.7) + 5 * (normDist * 0.7));
      let b = Math.round(58 * (1 - normDist * 0.7) + 18 * (normDist * 0.7));
      let a = 255;

      // Outer rounded corner masking for app icon
      const cornerR = width * 0.22;
      const cornerDx = Math.max(0, Math.abs(dx) - (cx - cornerR));
      const cornerDy = Math.max(0, Math.abs(dy) - (cy - cornerR));
      const cornerDist = Math.sqrt(cornerDx * cornerDx + cornerDy * cornerDy);
      if (cornerDist > cornerR) {
        a = 0; // Transparent outside rounded squircle
      }

      if (a > 0) {
        // Glowing celestial ring
        const ringDist = Math.abs(dist - width * 0.32);
        if (ringDist < width * 0.015) {
          const intensity = 1 - ringDist / (width * 0.015);
          r = Math.min(255, r + Math.round(192 * intensity));
          g = Math.min(255, g + Math.round(132 * intensity));
          b = Math.min(255, b + Math.round(252 * intensity));
        }

        // Central star glow
        const starDist = Math.sqrt(dx * dx + (dy + height * 0.05) * (dy + height * 0.05));
        if (starDist < width * 0.22) {
          const starGlow = 1 - (starDist / (width * 0.22));
          r = Math.min(255, r + Math.round(200 * starGlow * 0.6));
          g = Math.min(255, g + Math.round(140 * starGlow * 0.6));
          b = Math.min(255, b + Math.round(255 * starGlow * 0.6));
        }

        // Star 4-points (horizontal & vertical)
        const starY = dy + height * 0.05;
        const beamX = Math.abs(dx);
        const beamY = Math.abs(starY);
        const starLen = width * 0.16;
        const starThick = width * 0.02;

        if ((beamX < starThick && beamY < starLen) || (beamY < starThick && beamX < starLen)) {
          const fade = 1 - Math.max(beamX, beamY) / starLen;
          r = Math.min(255, r + Math.round(255 * fade));
          g = Math.min(255, g + Math.round(240 * fade));
          b = Math.min(255, b + Math.round(255 * fade));
        }

        // Diagonal star rays
        const diagDist1 = Math.abs(dx - starY) / Math.SQRT2;
        const diagLen1 = Math.abs(dx + starY) / Math.SQRT2;
        const diagDist2 = Math.abs(dx + starY) / Math.SQRT2;
        const diagLen2 = Math.abs(dx - starY) / Math.SQRT2;
        const diagMaxLen = width * 0.1;
        if ((diagDist1 < width * 0.015 && diagLen1 < diagMaxLen) || (diagDist2 < width * 0.015 && diagLen2 < diagMaxLen)) {
          r = Math.min(255, r + 220);
          g = Math.min(255, g + 180);
          b = Math.min(255, b + 255);
        }

        // Heart silhouette curve below star
        const hx = dx / (width * 0.2);
        const hy = -(dy - height * 0.04) / (width * 0.2);
        const heartEq = Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * Math.pow(hy, 3);
        if (Math.abs(heartEq) < 0.25 && hy > -1.2 && hy < 1.0) {
          r = Math.min(255, r + 230);
          g = Math.min(255, g + 120);
          b = Math.min(255, b + 230);
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Compress IDAT
  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(path.join(iconsDir, filename), pngBuffer);
  console.log(`Created public/icons/${filename} (${size}x${size}, ${pngBuffer.length} bytes)`);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcTarget = chunk.subarray(4, 8 + len);
  const crc = zlib.crc32(crcTarget);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Generate all target sizes
createPng(192, 'icon-192.png');
createPng(512, 'icon-512.png');
createPng(180, 'apple-touch-icon.png');
console.log('All PWA icons generated successfully!');
