import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // PERFORMANCE FIX: Defer all non-critical optimizations to avoid blocking page load
    const deferredOptimizations = () => {
      // Add Facebook Pixel preconnect after LCP (if needed)
      const fbPreconnect = document.createElement('link');
      fbPreconnect.rel = 'preconnect';
      fbPreconnect.href = 'https://connect.facebook.net';
      fbPreconnect.crossOrigin = 'anonymous';
      document.head.appendChild(fbPreconnect);
      
      // Preload next likely navigation targets after initial load
      const criticalRoutes = ['/gas-boilers', '/home-improvements', '/solar'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });

      // Service worker registration (non-blocking)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Silent fail for service worker
        });
      }

      // Set fetchpriority for updated hero images
      const heroImages = document.querySelectorAll('img[src*="9c72256e-c008-468d-8fb8-782177d8fddb"], img[src*="339dccf0-fb0b-4516-8463-6609ffa65db5"]');
      heroImages.forEach(img => {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync'); // Decode synchronously for LCP
      });
      
      // Ensure lazy loading for below-fold images
      const belowFoldImages = document.querySelectorAll('img:not([src*="9c72256e-c008-468d-8fb8-782177d8fddb"]):not([src*="339dccf0-fb0b-4516-8463-6609ffa65db5"])');
      belowFoldImages.forEach(img => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
        }
      });
    };

    // Use requestIdleCallback to defer all optimizations
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(deferredOptimizations, { timeout: 3000 });
    } else {
      setTimeout(deferredOptimizations, 2000);
    }
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;