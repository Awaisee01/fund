// High-Performance Cache Manager
class CacheManager {
  private memoryCache: Map<string, any>;
  private maxMemoryCacheSize: number;
  private localCache: any;

  constructor() {
    this.memoryCache = new Map();
    this.maxMemoryCacheSize = 50;
    this.initializeCaching();
  }

  initializeCaching() {
    // Browser cache optimization
    this.setupBrowserCache();
    
    // Local storage cache for user preferences
    this.setupLocalStorageCache();
  }

  setupBrowserCache() {
    // Set cache headers for static resources via meta tags
    if (typeof document !== 'undefined') {
      // Add cache control meta tags dynamically
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Cache-Control';
      meta.content = 'public, max-age=31536000, immutable';
      document.head.appendChild(meta);
    }
  }

  setupLocalStorageCache() {
    // Cache user preferences and form data
    this.localCache = {
      set: (key, value, ttl = 24 * 60 * 60 * 1000) => { // 24 hours default
        const item = {
          value,
          timestamp: Date.now(),
          ttl
        };
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(item));
        } catch (error) {
          // Storage full, clean old items
          this.cleanLocalCache();
        }
      },
      
      get: (key) => {
        try {
          const item = JSON.parse(localStorage.getItem(`cache_${key}`));
          if (!item) return null;
          
          if (Date.now() - item.timestamp > item.ttl) {
            localStorage.removeItem(`cache_${key}`);
            return null;
          }
          
          return item.value;
        } catch (error) {
          return null;
        }
      },
      
      delete: (key) => {
        localStorage.removeItem(`cache_${key}`);
      }
    };
  }

  cleanLocalCache() {
    // Remove expired cache items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (Date.now() - item.timestamp > item.ttl) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Memory cache for API responses
  setMemoryCache(key, value, ttl = 5 * 60 * 1000) { // 5 minutes default
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      // Remove oldest entry
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  getMemoryCache(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Image caching with compression
  async cacheImage(url) {
    try {
      if ('caches' in window) {
        const cache = await caches.open('images-v2.0');
        const response = await cache.match(url);
        
        if (response) {
          return response;
        }
        
        const fetchResponse = await fetch(url);
        if (fetchResponse.status === 200) {
          cache.put(url, fetchResponse.clone());
        }
        return fetchResponse;
      }
    } catch (error) {
      // Fallback to direct fetch
      return fetch(url);
    }
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      '/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.webp',
      '/css/index.css',
      '/js/main.js'
    ];

    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.setAttribute('fetchpriority', 'low');
      document.head.appendChild(link);
    });
  }
}

// Initialize cache manager
if (typeof window !== 'undefined') {
  (window as any).cacheManager = new CacheManager();
  
  // Preload resources when idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      (window as any).cacheManager.preloadCriticalResources();
    });
  }
}

export default CacheManager;