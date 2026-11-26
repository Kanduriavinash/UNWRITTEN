import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Register PWA Service Worker for offline capabilities and update notifications
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[UNWRITTEN PWA] Service Worker active with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[UNWRITTEN PWA] Service Worker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

