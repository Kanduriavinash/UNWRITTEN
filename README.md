<div align="center">

  <img src="public/logo.png" alt="UNWRITTEN Logo" width="90" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(168, 85, 247, 0.35);" />

  # UNWRITTEN
  ### *Your story. Still unwritten.*

  **An intentional, quiet college connection sanctuary built with zero superficial games, zero popularity contests, and 100% student privacy.**

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-unwritten--campus.vercel.app-7928CA?style=for-the-badge&logo=vercel&logoColor=white)](https://unwritten-campus.vercel.app)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![PWA](https://img.shields.io/badge/PWA-Standalone%20Ready-FF5722?style=for-the-badge&logo=pwa&logoColor=white)](#-mobile-pwa-engine)
  [![Security](https://img.shields.io/badge/Campus%20Domain-am.students.amrita.edu-22c55e?style=for-the-badge&logo=shieldsdotio&logoColor=white)](#-campus-security--privacy)

</div>

---

## 🌟 Overview

Most modern social applications reduce university students into rapid-swipe thumbnails, superficial popularity scores, and unsolicited DMs.

**UNWRITTEN** is intentionally built differently:
* 🕊️ **No Public Scores**: No follower counts, no public like numbers, and zero vanity leaderboards.
* 🛡️ **Campus Sanctuary**: Exclusively gated to verified `@am.students.amrita.edu` student accounts with strict institutional roll number validation.
* 🤍 **White Tick Verification**: Authentic campus ID card validation awarding the official **White Tick on Black Circle** badge (`#000000`).
* ⚡ **Gender-Curated Discovery**: Male students discover only female student stories; female students discover only male student stories.
* 📲 **Zero-App-Store PWA**: Installs directly onto mobile devices (Android & iOS Safari) as a full-screen, standalone app with offline caching and live update alerts.
* 🔔 **Celestial Soundscapes**: Integrated Web Audio harmonic synthesizer providing calm crystal tones ($E_5 \to A_5$) for notifications and ambient atmospheric drones.

---

## 🚀 Live Production Deployment

The platform is deployed and running live on **Vercel's Global Edge Network** with automatic SSL/TLS encryption, HTTP/2, and continuous deployment:

🌐 **Production URL**: **[https://unwritten-campus.vercel.app](https://unwritten-campus.vercel.app)**

---

## ✨ Key Feature Architecture

### 1. 🛡️ Campus Gating & Strict Privacy
* **Email Verification**: Access restricted strictly to verified institutional domains (`@am.students.amrita.edu`).
* **Format-Enforced Roll Numbers**: Enforces official campus student format (`AM.XX.XXXXXXXXXX`).
* **Security Disclaimer**: Explicit transparent assurance that credentials and student ID cards are collected solely for campus verification and never shared or sold.
* **Private Instagram Vault**: Instagram handles remain completely encrypted and hidden. They are only shared when both matched students deliberately tap *"Share Instagram"* inside a mutual chat.

### 2. 🤍 The Official Verified Badge
* Distinguishes authentic registered campus students.
* Consists of a crisp white checkmark enclosed inside a solid obsidian-black circular badge (`#000000`) with a luminous violet outer ring.
* Rendered on student profile cards, story dialogues, and account headers.

### 3. 🎓 Campus Engineering Departments
Pre-configured with official campus branch codes and flexible custom specialization handling:
* **`CSE`** — Computer Science & Engineering
* **`AIDS`** — Artificial Intelligence & Data Science
* **`AI`** — Artificial Intelligence
* **`RAI`** — Robotics & Artificial Intelligence
* **`ELC`** — Electronics & Computer Engineering
* **`EAC`** — Electronics & Communication Engineering
* **`EEE`** — Electrical & Electronics Engineering
* **`Other`** — Interactive custom input field allowing students to mention their specialized discipline (e.g. Mechanical, Biotech, MBA).

### 4. 📲 Mobile PWA Engine (Install Directly from Browser)
* **Android (Chrome / Edge / Brave)**: Captures `beforeinstallprompt` to offer a 1-click **"Install App 📲"** home-screen installation.
* **iPhone & iPad (Apple Safari)**: Provides an interactive visual 3-step guide:
  1. Tap the Safari **Share** icon (`⬆`).
  2. Scroll and select **"Add to Home Screen"** (`⊞`).
  3. Tap **"Add"** to launch UNWRITTEN in full-screen standalone mode without browser URL bars.
* **Offline Service Worker (`sw.js`)**: Employs network-first caching for instant cold starts and offline resilience.

### 5. 🔔 Real-Time Notifications & Celestial Chime
* **System & Web Push API**: Dispatches system banners for platform updates, new incoming whispers, and mutual match chats.
* **Dual-Tone Web Audio Synthesizer**: Pure programmatic audio generation playing an ascending harmonic crystal chime ($E_5 \to A_5$ at 659.25Hz and 880.0Hz).
* **Campus Updates Feed**: In-app notification center equipped with filters (*All*, *Updates*, *Requests*, *Chats*), unread pulse badges, and a **"Test Alert 🧪"** simulator.

### 6. 📊 9-Set Live Campus Analytics & Insights Dashboard
Interactive real-time campus telemetry tracking:
1. **Total Registered Students**: Live count with growth indicators.
2. **Live Radar Pulse**: Real-time active students with pulsing radar waves.
3. **Adoption Curve**: 7-day and 30-day interactive velocity trajectory graphs.
4. **Top 5 Hangout Hotspots**: Ranking popular meeting grounds (Central Library lawn steps, Lotus Pond benches, Old Canteen terrace).
5. **Mutual Handshakes**: Active whisper connection totals.
6. **Top Passions**: Leading student interests (Indie Music, 35mm Film, Camus Poetry, Late-Night Coding).
7. **Department Breakdown**: Percentage distribution across all campus branches.
8. **White Tick Verification & Gender Balance**: Ratio of ID-verified profiles and campus demographics.
9. **Cyber Security & Encryption Shield**: Real-time status of institutional domain locks and TLS 1.3 encryption.

### 7. 💬 Campus Help Desk & Community Guide
* Integrated student support drawer with four interactive sections:
  * **How It Works**: Transparent breakdown of quiet matching and sanctuary rules.
  * **Campus FAQs**: Answers covering privacy, invisible mode, and account security.
  * **Submit Query & Ideas**: Multi-category ticket submission (Features, Bugs, Safety, Feedback) with anonymous submission support.
  * **Community Feedback Board**: Live view of submitted queries and suggestions.

### 8. 🌌 Living Celestial Canvas Backdrop
* Ambient, GPU-accelerated HTML5 particle background with floating cosmic dust, shooting stars, and orbital connection nodes that respond gently to ambient time.

---

## 🛠️ Tech Stack & Engineering Standards

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Build & Tooling** | [Vite 6](https://vitejs.dev/) with Rollup chunk splitting |
| **Icons & Design Tokens** | [Lucide React](https://lucide.dev/), Custom BookHeart Vector Suite, CSS Variables |
| **Audio Synthesis** | Native Web Audio API (`AudioContext`, Oscillator nodes, Gain envelopes) |
| **PWA & Offline** | Web App Manifest, Service Worker Cache API, Stale-While-Revalidate |
| **Hosting & Edge** | [Vercel](https://vercel.com/) (Edge CDN, Automated Deployments, SPA Routing) |
| **Database Ready** | [Supabase](https://supabase.com/) PostgreSQL schema with Row-Level Security (RLS) |

---

## 📁 Repository Structure

```
UNWRITTEN/
├── public/
│   ├── favicon.ico              # Multi-resolution BookHeart favicon
│   ├── favicon.svg              # Lossless vector tab icon
│   ├── logo.png                 # Official BookHeart brand asset
│   ├── manifest.json            # PWA Web App Manifest (standalone configuration)
│   ├── sw.js                    # Service Worker (caching & notification handler)
│   └── icons/
│       ├── icon.svg             # High-res vector BookHeart logo
│       ├── icon-192.png         # 192x192 PWA home screen icon
│       ├── icon-512.png         # 512x512 maskable app icon
│       └── apple-touch-icon.png # 180x180 iOS touch icon
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx        # Mobile sticky navigation bar
│   │   ├── CampusAuthView.tsx   # Gated onboarding, roll number & ID verification
│   │   ├── CelestialCanvas.tsx  # Ambient cosmic particle background
│   │   ├── ChatTab.tsx          # Real-time mutual whisper chats
│   │   ├── DiscoverTab.tsx      # Gender-curated student discovery cards
│   │   ├── HelpDeskModal.tsx    # Campus Help Desk, FAQs & suggestions
│   │   ├── InsightsTab.tsx      # 9-Set live campus analytics dashboard
│   │   ├── InstallModal.tsx     # Android 1-click & iOS Safari visual install guide
│   │   ├── Navigation.tsx       # Desktop header with notification bell & brand
│   │   ├── NotificationModal.tsx# Real-time campus updates & alert center
│   │   ├── ProfileTab.tsx       # Student story editor, department & invisible mode
│   │   ├── RequestsTab.tsx      # Incoming & outgoing connection requests
│   │   ├── SavedTab.tsx         # Quiet reflection bookmarks
│   │   ├── StoryPrologue.tsx    # 4-chapter interactive onboarding narrative
│   │   └── VerifiedBadge.tsx    # Official White Tick on Black Circle badge
│   ├── data/
│   │   └── mockData.ts          # Curated campus demo stories & interests
│   ├── lib/
│   │   ├── notifications.ts     # Push notification manager & real-time store
│   │   ├── soundscapes.ts       # Web Audio synthesizer & celestial chimes
│   │   ├── supabase.ts          # Cloud backend client connection scaffold
│   │   ├── syncStore.ts         # Ephemeral cross-tab state synchronization
│   │   └── validation.ts        # Roll number & email domain security validators
│   ├── types/
│   │   └── index.ts             # Comprehensive TypeScript domain types
│   ├── App.tsx                  # Root orchestration & modal management
│   ├── index.css                # Celestial violet design system (`#0b0512`)
│   └── main.tsx                 # Entrypoint & Service Worker registration
├── scripts/
│   ├── generate-bookheart-logo.cjs # Vector SVG generator
│   └── generate-bookheart-pngs.cjs # High-res unfilter PNG icon resampler
├── vercel.json                  # SPA rewrites, caching headers & security policies
└── package.json                 # Project dependencies & scripts
```

---

## 💻 Local Development

### Prerequisites
* **Node.js**: `v20.0.0` or newer (Tested on Node.js `v24.18.0`)
* **Package Manager**: `npm` (v10+)

### 1. Clone the repository
```bash
git clone https://github.com/<your-organization>/UNWRITTEN.git
cd UNWRITTEN
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```
Generates an optimized, tree-shaken static bundle in the `dist/` directory ready for deployment.

---

## 🔒 Privacy & Safety Pledge

* **Zero Advertisements & Zero Tracking**: No third-party ad networks, tracking pixels, or invasive telemetry cookies.
* **Anonymous Operations**: Built as a quiet student sanctuary where stories bloom naturally without public scrutiny.
* **Encrypted Student Metadata**: Private personal handles are held in isolation and exchanged solely through explicit bilateral consent.

---

<div align="center">
  <sub>Crafted with care for collegiate sanctuaries everywhere ♡</sub><br/>
  <sub>UNWRITTEN · CAMPUS EDITION</sub>
</div>
