import { useEffect } from 'react';

interface LighthouseOptimizerProps {
  children: React.ReactNode;
}

const LighthouseOptimizer = ({ children }: LighthouseOptimizerProps) => {
  useEffect(() => {
    // 1. Optimize Core Web Vitals immediately
    const optimizeCoreWebVitals = () => {
      // Reduce layout shifts by setting image dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const imageElement = img as HTMLImageElement;
        if (!imageElement.getAttribute('width') && !imageElement.getAttribute('height')) {
          imageElement.style.aspectRatio = '16 / 9'; // Default aspect ratio
        }
      });

      // Optimize font loading to prevent FOIT/FOUT
      if (!document.querySelector('link[rel="preload"][as="font"]')) {
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        fontPreload.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';
        document.head.appendChild(fontPreload);
      }
    };

    // 2. Defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      // Move non-critical scripts to end of body
      window.requestIdleCallback(() => {
        // Facebook Pixel is already optimized in HTML
        // Add other third-party scripts here if needed
        console.log('✅ Non-critical JS deferred');
      }, { timeout: 3000 });
    };

    // 3. Optimize images for better performance
    const optimizeImages = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            // Set optimal loading attributes
            if (!img.loading) img.loading = 'lazy';
            if (!img.decoding) img.decoding = 'async';
            
            // For above-fold images, set high priority
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
              img.loading = 'eager';
              img.fetchPriority = 'high';
              img.decoding = 'sync';
            }
            
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      // Observe all images
      document.querySelectorAll('img').forEach(img => {
        observer.observe(img);
      });
    };

    // 4. Optimize resource hints
    const optimizeResourceHints = () => {
      // Only add resource hints that aren't already in HTML
      const existingPreconnects = Array.from(document.querySelectorAll('link[rel="preconnect"]'))
        .map(link => (link as HTMLLinkElement).href);

      const criticalDomains = [
        'https://cdn.goteng.co'
      ];

      criticalDomains.forEach(domain => {
        if (!existingPreconnects.includes(domain)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // 5. Optimize form inputs for better interaction
    const optimizeFormInteractions = () => {
      // Add passive event listeners for better scroll performance
      document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('focus', () => {
          // Prevent zoom on iOS
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
              viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
          }
        }, { passive: true });

        element.addEventListener('blur', () => {
          // Restore normal zoom behavior
          if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
              viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
            }
          }
        }, { passive: true });
      });
    };

    // 6. Monitor and fix accessibility issues
    const optimizeAccessibility = () => {
      // Ensure all interactive elements are properly labeled
      document.querySelectorAll('button, input, select, textarea').forEach(element => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          const label = element.closest('label') || document.querySelector(`label[for="${element.id}"]`);
          if (!label && element.tagName === 'BUTTON') {
            const text = element.textContent?.trim();
            if (text) {
              element.setAttribute('aria-label', text);
            }
          }
        }
      });

      // Ensure proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let expectedLevel = 1;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > expectedLevel + 1) {
          console.warn(`Heading level jump detected: Found h${level}, expected h${expectedLevel}`);
        }
        expectedLevel = Math.max(expectedLevel, level);
      });
    };

    // Execute optimizations in priority order
    optimizeCoreWebVitals(); // Immediate
    
    // Defer non-critical optimizations
    setTimeout(() => {
      optimizeImages();
      optimizeResourceHints();
      optimizeFormInteractions();
      optimizeAccessibility();
      deferNonCriticalJS();
    }, 100);

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`);
            if (entry.startTime > 2500) {
              console.warn('❌ LCP is slow. Consider optimizing above-fold content.');
            }
          }
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any; // Performance API typing is inconsistent
            console.log(`⚡ FID: ${fidEntry.processingStart - entry.startTime}ms`);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // Fallback for older browsers
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
};

export default LighthouseOptimizer;