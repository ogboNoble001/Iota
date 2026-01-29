const CACHE_VERSION = 'v2'; // INCREMENT THIS when you make changes!
const CACHE_NAME = `iota-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/site.webmanifest',
  '/favicon-96x96.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/assets/fonts/chillax.css',
  '/assets/imgs/20260126_151700.jpg',
  '/assets/imgs/20260126_160735.png',
  '/assets/imgs/output-onlinegiftools.gif',
  '/assets/imgs/image-3.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(urlsToCache);
    })
    .catch((error) => {
      console.error('[SW] Cache failed:', error);
    })
  );
  self.skipWaiting(); // Force activation of new service worker
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim(); // Take control immediately
});

// Fetch event - NETWORK FIRST for HTML/JS/CSS, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Network first for HTML, CSS, and JS files
  if (
    request.url.includes('.html') ||
    request.url.includes('.js') ||
    request.url.includes('.css') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(request)
      .then((response) => {
        // Update cache with fresh content
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request);
      })
    );
  }
  // Cache first for images and fonts (they don't change often)
  else {
    event.respondWith(
      caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback to offline page
        return caches.match('/index.html');
      })
    );
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});