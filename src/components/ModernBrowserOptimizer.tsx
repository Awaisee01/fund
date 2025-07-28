import { useEffect } from 'react';

const ModernBrowserOptimizer = () => {
  useEffect(() => {
    // 1. Detect and optimize for modern browsers
    const isModernBrowser = () => {
      return (
        'noModule' in HTMLScriptElement.prototype &&
        window.IntersectionObserver &&
        window.Promise &&
        window.fetch &&
        Array.prototype.includes &&
        String.prototype.startsWith &&
        'serviceWorker' in navigator
      );
    };

    // 2. Add modern browser optimizations
    if (isModernBrowser()) {
      document.documentElement.classList.add('modern-browser');
      document.documentElement.setAttribute('data-js-target', 'es2020');
      
      // Enable modern CSS features
      document.documentElement.style.setProperty('--supports-modern', '1');
      
      // Remove legacy polyfills
      const polyfills = document.querySelectorAll('script[src*="polyfill"]');
      polyfills.forEach(script => script.remove());
      
      console.log('✅ Modern browser optimizations enabled');
    }

    // 3. Optimize critical request chains
    const optimizeCriticalChains = () => {
      // Preload critical resources
      const criticalResources = [
        { href: '/assets/js/react-core.js', as: 'script' },
        { href: '/assets/css/index.css', as: 'style' },
        { href: '/lovable-uploads/hero-desktop.webp', as: 'image', type: 'image/webp' }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.as === 'script') link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // 4. Enable cache headers for static assets
    const enableStaticCaching = () => {
      // Add meta hints for caching
      const cacheControl = document.createElement('meta');
      cacheControl.httpEquiv = 'Cache-Control';
      cacheControl.content = 'public, max-age=31536000, immutable';
      document.head.appendChild(cacheControl);
    };

    // 5. Reduce TTFB with edge caching hints
    const optimizeTTFB = () => {
      // Add edge caching headers
      const edgeCache = document.createElement('meta');
      edgeCache.httpEquiv = 'CDN-Cache-Control';
      edgeCache.content = 'max-age=31536000';
      document.head.appendChild(edgeCache);

      // Enable server-side caching hints
      const serverCache = document.createElement('meta');
      serverCache.httpEquiv = 'Surrogate-Control';
      serverCache.content = 'max-age=3600';
      document.head.appendChild(serverCache);
    };

    // Execute optimizations
    optimizeCriticalChains();
    enableStaticCaching();
    optimizeTTFB();

    console.log('🚀 Modern browser optimizer activated');
  }, []);

  return null;
};

export default ModernBrowserOptimizer;