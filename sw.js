// Service Worker — network-first, omgår cache
// Versionen opdateres ved hver deploy for at tvinge geninstallation
const CACHE = 'wealthhealth-v' + Date.now();

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  // Slet ALLE gamle caches — tvinger browser til at hente alt på ny
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Altid network-first for HTML — aldrig cache dokumenter
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
    return;
  }
  // CDN-scripts (chart.js, papaparse, xlsx) — lad browser håndtere normalt
  // Alt andet — network-first
});
