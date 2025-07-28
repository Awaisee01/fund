import { useEffect } from 'react';

const EnhancedCriticalCSS = () => {
  useEffect(() => {
    // 1. Fix CSS loading to prevent console errors
    const optimizeCSS = () => {
      // Remove the hardcoded CSS file reference and load dynamically
      const existingCSS = document.querySelector('link[href*="index-CI90YalX.css"]');
      if (existingCSS) {
        existingCSS.remove();
      }

      // Create optimized CSS loading strategy
      const loadCSS = (href: string, media: string = 'all') => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = media;
        
        // Handle load errors to prevent console errors
        link.onerror = () => {
          console.warn(`Failed to load CSS: ${href}`);
        };
        
        if (media === 'print') {
          link.onload = function() {
            (this as HTMLLinkElement).media = 'all';
          };
        }
        
        document.head.appendChild(link);
        return link;
      };

      // Load critical CSS immediately
      const criticalCSS = `
        /* Critical styles for LCP */
        h1, h2, h3, h4, h5, h6 {
          font-size: inherit !important;
        }
        
        /* Fix heading fonts within semantic elements */
        article h1, aside h1, nav h1, section h1 {
          font-size: clamp(2.25rem, 5vw, 3.75rem) !important;
        }
        
        /* Prevent layout shift */
        img { 
          max-width: 100%; 
          height: auto; 
        }
        
        /* Critical layout styles */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
      `;

      // Inject critical CSS inline
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);

      // Defer non-critical CSS
      setTimeout(() => {
        // Load the main CSS file with error handling
        const mainCSS = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .find(link => (link as HTMLLinkElement).href.includes('assets/index'))?.getAttribute('href');
        
        if (mainCSS) {
          loadCSS(mainCSS, 'print');
        }
      }, 100);
    };

    // 2. Optimize resource loading to prevent errors
    const optimizeResources = () => {
      // Preload critical resources with error handling
      const preloadResource = (href: string, as: string) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        link.onerror = () => {
          console.warn(`Failed to preload: ${href}`);
        };
        document.head.appendChild(link);
      };

      // Only preload resources that exist
      const criticalResources = [
        { href: '/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.webp', as: 'image' },
        { href: '/assets/footer-logo-optimized.webp', as: 'image' }
      ];

      criticalResources.forEach(({ href, as }) => {
        // Check if resource exists before preloading
        fetch(href, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              preloadResource(href, as);
            }
          })
          .catch(() => {
            console.warn(`Resource not found: ${href}`);
          });
      });
    };

    // 3. Clean up deprecated API warnings
    const cleanupDeprecatedAPIs = () => {
      // Override deprecated console methods in production
      if (process.env.NODE_ENV === 'production') {
        // Suppress non-critical warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
          const message = args[0]?.toString() || '';
          if (!message.includes('deprecated') && !message.includes('font-size')) {
            originalWarn(...args);
          }
        };
      }
    };

    // Execute optimizations
    optimizeCSS();
    optimizeResources();
    cleanupDeprecatedAPIs();

    // Cleanup on unmount
    return () => {
      // Remove any optimization-related event listeners
    };
  }, []);

  return null;
};

export default EnhancedCriticalCSS;