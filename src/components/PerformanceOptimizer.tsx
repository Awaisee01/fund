import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // Preload critical resources after initial render
    const preloadCriticalResources = () => {
      // Preload next likely navigation targets
      const criticalRoutes = ['/gas-boilers', '/home-improvements', '/solar', '/contact'];
      
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Load non-critical scripts after LCP
    const loadNonCriticalScripts = () => {
      // Service worker registration
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Silent fail for service worker
        });
      }
    };

    // Optimize scroll performance
    const optimizeScrolling = () => {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            // Lazy load images in viewport
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
              const rect = img.getBoundingClientRect();
              if (rect.top < window.innerHeight + 100) {
                img.removeAttribute('loading');
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    };

    // Execute optimizations after initial render
    const timer = setTimeout(() => {
      preloadCriticalResources();
      loadNonCriticalScripts();
      const cleanup = optimizeScrolling();
      
      return cleanup;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;