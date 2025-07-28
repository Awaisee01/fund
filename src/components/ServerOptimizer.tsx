import { useEffect } from 'react';

export function ServerOptimizer() {
  useEffect(() => {
    // Preload critical resources to improve response times
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/assets/index-CjeIoeAC.css',
        '/assets/js/index-CDVpjcea.js'
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      });
    };

    // Optimize server response with compression
    const optimizeServerResponse = () => {
      // Enable service worker for caching if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Silently handle service worker registration failures
        });
      }
    };

    preloadCriticalResources();
    optimizeServerResponse();
  }, []);

  return null;
}