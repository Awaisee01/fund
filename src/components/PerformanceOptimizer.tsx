import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // Defer non-critical resource loading
    const deferNonCriticalResources = () => {
      // Add Facebook Pixel preconnect after LCP (if needed)
      const fbPreconnect = document.createElement('link');
      fbPreconnect.rel = 'preconnect';
      fbPreconnect.href = 'https://connect.facebook.net';
      fbPreconnect.crossOrigin = 'anonymous';
      document.head.appendChild(fbPreconnect);
      
      // Remove unused font weight 500 to reduce requests
      
      // Preload next likely navigation targets after initial load
      const criticalRoutes = ['/gas-boilers', '/home-improvements', '/solar'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Load non-critical scripts after LCP
    const loadNonCriticalScripts = () => {
      // Service worker registration (non-blocking)
      if ('serviceWorker' in navigator && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          navigator.serviceWorker.register('/sw.js').catch(() => {
            // Silent fail for service worker
          });
        });
      }
    };

    // Optimize image loading for better LCP
    const optimizeImageLoading = () => {
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

    // Execute optimizations in order of priority
    const timer = setTimeout(() => {
      optimizeImageLoading(); // Immediate
      
      // Defer non-critical resources after LCP
      window.requestIdleCallback ? 
        window.requestIdleCallback(() => {
          deferNonCriticalResources();
          loadNonCriticalScripts();
        }) : 
        setTimeout(() => {
          deferNonCriticalResources();
          loadNonCriticalScripts();
        }, 2000);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;