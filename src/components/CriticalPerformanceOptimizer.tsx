import { useEffect } from 'react';

interface CriticalPerformanceOptimizerProps {
  children: React.ReactNode;
}

const CriticalPerformanceOptimizer = ({ children }: CriticalPerformanceOptimizerProps) => {
  useEffect(() => {
    // 1. Critical resource hints for immediate loading
    const addCriticalResourceHints = () => {
      const head = document.head;
      
      // Preconnect to critical domains
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];
      
      preconnectDomains.forEach(domain => {
        if (!document.querySelector(`link[href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          head.appendChild(link);
        }
      });
      
      // Preload critical hero images for LCP
      const heroImages = [
        '/lovable-uploads/AerialTownDesktop.webp',
        '/lovable-uploads/e6d7f9f8-3fec-4e65-915a-0292e7eaf42a.png'
      ];
      
      heroImages.forEach(imageSrc => {
        const heroImagePreload = document.createElement('link');
        heroImagePreload.rel = 'preload';
        heroImagePreload.as = 'image';
        heroImagePreload.href = imageSrc;
        heroImagePreload.fetchPriority = 'high';
        head.appendChild(heroImagePreload);
      });
    };

    // 2. Optimize images immediately
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (index === 0) {
          // First image (LCP candidate)
          img.loading = 'eager';
          img.fetchPriority = 'high';
          img.decoding = 'sync';
        } else {
          // Other images
          img.loading = 'lazy';
          img.decoding = 'async';
        }
      });
    };

    // 3. Eliminate render-blocking CSS
    const optimizeCSS = () => {
      // Move non-critical CSS to load async
      const criticalCSS = document.querySelector('style[data-critical]');
      if (!criticalCSS) {
        const style = document.createElement('style');
        style.setAttribute('data-critical', 'true');
        style.textContent = `
          /* Critical above-the-fold styles */
          .hero-gradient { background: linear-gradient(135deg, rgb(37 99 235), rgb(34 197 94)); }
          .form-card { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.2); }
        `;
        document.head.appendChild(style);
      }
    };

    // 4. Defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      // Defer analytics and non-critical scripts
      setTimeout(() => {
        // Service worker registration
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
      }, 2000);
    };

    // 5. Optimize main thread by batching DOM operations
    const batchDOMOperations = () => {
      requestAnimationFrame(() => {
        addCriticalResourceHints();
        optimizeImages();
        optimizeCSS();
        deferNonCriticalJS();
      });
    };

    // Start optimization immediately
    batchDOMOperations();

    // Re-optimize when new images are added
    const observer = new MutationObserver(() => {
      requestIdleCallback(optimizeImages);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export default CriticalPerformanceOptimizer;
