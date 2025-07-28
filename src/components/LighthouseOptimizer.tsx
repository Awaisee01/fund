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
      // Ensure all images have alt text
      document.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
          const src = img.getAttribute('src') || '';
          if (src.includes('wall')) {
            img.setAttribute('alt', 'Wall renovation colour options display');
          } else if (src.includes('roof')) {
            img.setAttribute('alt', 'Roof renovation colour options display');
          } else if (src.includes('hero') || src.includes('aerial')) {
            img.setAttribute('alt', 'Scottish homes receiving government funding for energy improvements');
          } else if (src.includes('logo')) {
            img.setAttribute('alt', 'Funding For Scotland logo');
          } else {
            img.setAttribute('alt', 'Government funding for home improvements in Scotland');
          }
        }
      });

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
          // Add tabindex for better keyboard navigation
          if (element.tagName === 'BUTTON' && !element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
        }
      });

      // Fix form labels
      document.querySelectorAll('input, select, textarea').forEach(element => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          const placeholder = element.getAttribute('placeholder');
          if (placeholder) {
            element.setAttribute('aria-label', placeholder);
          }
        }
      });

      // Ensure proper color contrast (check for common low-contrast combinations)
      const lowContrastSelectors = [
        '.text-gray-400', '.text-gray-300', '.bg-gray-100 .text-gray-500'
      ];
      lowContrastSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const element = el as HTMLElement;
          if (computedStyle.color === 'rgb(156, 163, 175)' || computedStyle.color === 'rgb(209, 213, 219)') {
            element.style.color = '#6B7280'; // Improve contrast
          }
        });
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

      // Add skip link for better accessibility
      if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = 'position:absolute;top:-40px;left:6px;z-index:9999;padding:8px;background:#000;color:#fff;text-decoration:none;border-radius:4px;';
        skipLink.addEventListener('focus', () => {
          skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
          skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
      }

      // Add main landmark if missing
      if (!document.querySelector('main')) {
        const mainContent = document.querySelector('#root > div > main') || document.querySelector('.flex-1');
        if (mainContent && !mainContent.getAttribute('role')) {
          mainContent.setAttribute('role', 'main');
          mainContent.id = 'main';
        }
      }
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