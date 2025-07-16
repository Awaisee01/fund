import { useEffect } from 'react';

// Performance optimization hook
export const usePagePerformance = (pageName: string) => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload next likely pages
      const criticalPages = ['/eco4', '/solar', '/gas-boilers', '/home-improvements'];
      criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
    };

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Run performance optimizations after page load
    const timer = setTimeout(() => {
      preloadCriticalResources();
      optimizeImages();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pageName]);
};

// Viewport optimization
export const useViewportOptimization = () => {
  useEffect(() => {
    // Add viewport meta tag if not present
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Optimize touch interactions
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
      }
      
      button, a, [role="button"] {
        touch-action: manipulation;
        min-height: 44px;
        min-width: 44px;
      }
      
      input, textarea, select {
        font-size: 16px;
      }
      
      @media (max-width: 768px) {
        input, textarea, select {
          font-size: 16px !important;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};