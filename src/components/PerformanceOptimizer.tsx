import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // Defer non-critical resource loading
    const deferNonCriticalResources = () => {
      // Defer additional font weights after LCP
      const additionalFonts = document.createElement('link');
      additionalFonts.rel = 'stylesheet';
      additionalFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap';
      additionalFonts.media = 'print';
      additionalFonts.onload = function() {
        (this as HTMLLinkElement).media = 'all';
      };
      document.head.appendChild(additionalFonts);
      
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
      // Set fetchpriority for hero images
      const heroImages = document.querySelectorAll('img[src*="aceccd77-e1e4-46e3-9541-75492bfd3619"]');
      heroImages.forEach(img => {
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
      });
      
      // Ensure lazy loading for below-fold images
      const belowFoldImages = document.querySelectorAll('img:not([src*="aceccd77-e1e4-46e3-9541-75492bfd3619"])');
      belowFoldImages.forEach(img => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
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