// High-Performance Service Worker with Aggressive Caching v4.0
const CACHE_NAME = 'funding-scotland-v4.0';
const STATIC_CACHE = 'static-assets-v4.0';
const DYNAMIC_CACHE = 'dynamic-content-v4.0';
const IMAGE_CACHE = 'images-v4.0';

// Define cache strategies for different resource types
const CACHE_STRATEGIES = {
  // Static assets - cache first, very long TTL
  static: {
    cacheName: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 100
  },
  // Images - cache first with compression
  images: {
    cacheName: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  },
  // API responses - network first with stale-while-revalidate
  api: {
    cacheName: DYNAMIC_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  // Pages - network first with cache fallback
  pages: {
    cacheName: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 30
  }
};

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/eco4',
  '/solar',
  '/gas-boilers',
  '/home-improvements',
  '/contact'
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE),
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(([staticCache, dynamicCache, imageCache]) => {
      return staticCache.addAll(PRECACHE_URLS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_STRATEGIES).some(strategy => strategy.cacheName === cacheName) && 
              cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine cache strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.static));
  } else if (isImage(url)) {
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.images));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, CACHE_STRATEGIES.api));
  } else if (isPageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STRATEGIES.pages));
  }
});

// Cache-first strategy for static assets
async function cacheFirst(request, strategy) {
  try {
    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy for API requests
async function networkFirst(request, strategy) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(strategy.cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy for pages
async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Helper functions to determine resource types
function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|eot)(\?.*)?$/.test(url.pathname);
}

function isImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/.test(url.pathname);
}

function isApiRequest(url) {
  return url.hostname.includes('supabase') || url.pathname.startsWith('/api/');
}

function isPageRequest(url) {
  return url.origin === self.location.origin && !isStaticAsset(url) && !isImage(url);
}