const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const srcPath = 'C:/Users/kandu/.gemini/antigravity/brain/7c0e4eed-9dba-4e58-a89b-4392abd073f7/.user_uploaded/media_1795676441297_5a8d8268.png';
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const publicDir = path.join(__dirname, '..', 'public');

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// 1. Decode & Unfilter the PNG into clean RGBA buffer
function decodePngWithUnfilter(filePath) {
  const buf = fs.readFileSync(filePath);
  let p = 8;
  let idatList = [];
  let W, H;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.subarray(p + 4, p + 8).toString('ascii');
    if (type === 'IHDR') {
      W = buf.readUInt32BE(p + 8);
      H = buf.readUInt32BE(p + 12);
    } else if (type === 'IDAT') {
      idatList.push(buf.subarray(p + 8, p + 8 + len));
    }
    p += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatList));
  const bpp = 4;
  const stride = W * bpp;
  const uncompressed = Buffer.alloc(H * stride);

  let src = 0;
  let prevLine = Buffer.alloc(stride);

  for (let y = 0; y < H; y++) {
    const filter = raw[src++];
    const currLine = uncompressed.subarray(y * stride, (y + 1) * stride);

    for (let x = 0; x < stride; x++) {
      const byte = raw[src++];
      const left = x >= bpp ? currLine[x - bpp] : 0;
      const up = prevLine[x];
      const upLeft = x >= bpp ? prevLine[x - bpp] : 0;

      let val = 0;
      if (filter === 0) val = byte;
      else if (filter === 1) val = (byte + left) & 0xff;
      else if (filter === 2) val = (byte + up) & 0xff;
      else if (filter === 3) val = (byte + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) val = (byte + paeth(left, up, upLeft)) & 0xff;

      currLine[x] = val;
    }
    prevLine = currLine;
  }

  return { width: W, height: H, pixels: uncompressed, stride };
}

const logo = decodePngWithUnfilter(srcPath);
console.log(`Successfully unfiltered source logo: ${logo.width}x${logo.height}`);

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

// 2. High Quality Resampler onto dark midnight violet squircle
function renderLogoIcon(targetSize, filename) {
  const W = targetSize;
  const H = targetSize;
  const rawData = Buffer.alloc((W * 4 + 1) * H);

  // Logo box bounds: tight crop on the book glyph (y: 5 to 45, x: 8 to 42)
  const cropX0 = 5;
  const cropY0 = 5;
  const cropW = 40;
  const cropH = 42;

  // Scale tightly centered
  const scale = (targetSize * 0.72) / cropH;
  const renderedW = cropW * scale;
  const renderedH = cropH * scale;
  const startX = (W - renderedW) / 2;
  const startY = (H - renderedH) / 2;

  const cx = W / 2;
  const cy = H / 2;
  const maxR = W / 2;

  let offset = 0;
  for (let y = 0; y < H; y++) {
    rawData[offset++] = 0; // Filter 0
    for (let x = 0; x < W; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / maxR;

      // Celestial midnight gradient: #22103a in center -> #0b0512 at edge
      let r = Math.round(34 * (1 - normDist * 0.65) + 11 * (normDist * 0.65));
      let g = Math.round(16 * (1 - normDist * 0.65) + 5 * (normDist * 0.65));
      let b = Math.round(58 * (1 - normDist * 0.65) + 18 * (normDist * 0.65));
      let a = 255;

      // Squircle outer corner clipping
      const cornerR = W * 0.22;
      const cornerDx = Math.max(0, Math.abs(dx) - (cx - cornerR));
      const cornerDy = Math.max(0, Math.abs(dy) - (cy - cornerR));
      const cornerDist = Math.sqrt(cornerDx * cornerDx + cornerDy * cornerDy);
      if (cornerDist > cornerR) {
        a = 0;
      }

      if (a > 0) {
        // Soft violet glowing halo behind logo
        if (dist < W * 0.38) {
          const glow = Math.pow(1 - dist / (W * 0.38), 1.6);
          r = Math.min(255, r + Math.round(192 * glow * 0.35));
          g = Math.min(255, g + Math.round(132 * glow * 0.35));
          b = Math.min(255, b + Math.round(252 * glow * 0.35));
        }

        // Map x, y into cropped source logo coordinates
        const lx = cropX0 + (x - startX) / scale;
        const ly = cropY0 + (y - startY) / scale;

        if (lx >= 0 && lx < logo.width - 1 && ly >= 0 && ly < logo.height - 1) {
          const x0 = Math.floor(lx);
          const y0 = Math.floor(ly);
          const x1 = x0 + 1;
          const y1 = y0 + 1;
          const fx = lx - x0;
          const fy = ly - y0;

          const idx00 = y0 * logo.stride + x0 * 4;
          const idx10 = y0 * logo.stride + x1 * 4;
          const idx01 = y1 * logo.stride + x0 * 4;
          const idx11 = y1 * logo.stride + x1 * 4;

          const sampleR =
            logo.pixels[idx00] * (1 - fx) * (1 - fy) +
            logo.pixels[idx10] * fx * (1 - fy) +
            logo.pixels[idx01] * (1 - fx) * fy +
            logo.pixels[idx11] * fx * fy;

          const sampleG =
            logo.pixels[idx00 + 1] * (1 - fx) * (1 - fy) +
            logo.pixels[idx10 + 1] * fx * (1 - fy) +
            logo.pixels[idx01 + 1] * (1 - fx) * fy +
            logo.pixels[idx11 + 1] * fx * fy;

          const sampleB =
            logo.pixels[idx00 + 2] * (1 - fx) * (1 - fy) +
            logo.pixels[idx10 + 2] * fx * (1 - fy) +
            logo.pixels[idx01 + 2] * (1 - fx) * fy +
            logo.pixels[idx11 + 2] * fx * fy;

          // The source logo background is dark (~20), the glyph is bright lilac (~180-240)
          const brightness = (sampleR + sampleG + sampleB) / 3;

          if (brightness > 35) {
            // Glyph pixel! Boost and blend onto icon
            const glyphAlpha = Math.min(1, Math.max(0, (brightness - 35) / 50));
            // Enhance lilac brilliance
            const boostedR = Math.min(255, sampleR * 1.15 + 20);
            const boostedG = Math.min(255, sampleG * 1.08 + 10);
            const boostedB = Math.min(255, sampleB * 1.15 + 25);

            r = Math.round(r * (1 - glyphAlpha) + boostedR * glyphAlpha);
            g = Math.round(g * (1 - glyphAlpha) + boostedG * glyphAlpha);
            b = Math.round(b * (1 - glyphAlpha) + boostedB * glyphAlpha);
          }
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  const outPath = path.join(iconsDir, filename);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated BookHeart icon: ${filename} (${W}x${H}, ${pngBuffer.length} bytes)`);

  if (filename === 'icon-192.png') {
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngBuffer);
    console.log(`Updated public/favicon.ico`);
  }
}

renderLogoIcon(192, 'icon-192.png');
renderLogoIcon(512, 'icon-512.png');
renderLogoIcon(180, 'apple-touch-icon.png');
console.log('All BookHeart icons generated successfully!');
