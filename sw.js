const CACHE_NAME = 'valprimos-v1';
const ASSETS = [
  '/index.html',
  '/jugadores.html',
  '/historia.html',
  '/galeria.html',
  '/calendario.html',
  '/tienda.html',
  '/contacto.html',
  '/noticias.html',
  '/fantasy.html',
  '/escudo.png',
  '/manifest.json'
];

// Instalar: guardar en caché los recursos principales
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar: borrar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first para Google Sheets (fantasy), cache-first para el resto
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Para Google Sheets siempre intentar red primero
  if (url.includes('docs.google.com') || url.includes('fonts.googleapis.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Para el resto: cache primero, red como respaldo
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // Guardar en caché respuestas válidas
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
