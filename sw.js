const CACHE_NAME = 'valprimos-20260529021122';
const BASE = '/Valprimos';
const ASSETS = [BASE+'/index.html',BASE+'/jugadores.html',BASE+'/historia.html',BASE+'/galeria.html',BASE+'/calendario.html',BASE+'/tienda.html',BASE+'/contacto.html',BASE+'/noticias.html',BASE+'/fantasy.html',BASE+'/escudo.png',BASE+'/manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('docs.google.com') || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) { e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); return; }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => { if (r && r.status === 200 && r.type === 'basic') caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone())); return r; })).catch(() => caches.match(BASE+'/index.html')));
});
