import { useEffect } from 'react';

interface ScriptOptimizerProps {
  children: React.ReactNode;
}

const ScriptOptimizer = ({ children }: ScriptOptimizerProps) => {
  useEffect(() => {
    // 1. Defer Facebook Pixel until after LCP
    const deferFacebookPixel = () => {
      // Remove existing Facebook script if present
      const existingFbScript = document.querySelector('script[src*="fbevents.js"]');
      if (existingFbScript) {
        existingFbScript.remove();
      }

      // Load Facebook Pixel after user interaction or 3 seconds
      const loadFbPixel = () => {
        if ((window as any).fbq) return; // Already loaded
        
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      };

      // Defer until user interaction or 3 seconds
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      const deferLoad = () => {
        events.forEach(event => document.removeEventListener(event, deferLoad));
        setTimeout(loadFbPixel, 100);
      };

      events.forEach(event => document.addEventListener(event, deferLoad, { passive: true }));
      setTimeout(deferLoad, 3000); // Fallback after 3 seconds
    };

    // 2. Defer Lovable script
    const deferLovableScript = () => {
      const existingLovableScript = document.querySelector('script[src*="lovable.js"]');
      if (existingLovableScript) {
        existingLovableScript.remove();
      }

      // Load after everything else
      setTimeout(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.gpteng.co/lovable.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }, 5000);
    };

    // 3. Optimize chunk loading strategy
    const optimizeChunkLoading = () => {
      // Preload critical chunks only
      const criticalChunks = [
        'react-core', // React essentials
        'index' // Main app bundle
      ];

      criticalChunks.forEach(chunk => {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = `/assets/${chunk}.js`;
        document.head.appendChild(link);
      });

      // Defer non-critical chunks
      setTimeout(() => {
        const nonCriticalChunks = [
          'supabase', // Database operations
          'ui-components' // UI library components
        ];

        nonCriticalChunks.forEach(chunk => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = `/assets/${chunk}.js`;
          document.head.appendChild(link);
        });
      }, 2000);
    };

    // 4. Remove unused CSS and JS
    const removeUnusedAssets = () => {
      // Mark non-critical CSS for deferred loading
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
      nonCriticalCSS.forEach(link => {
        const linkElement = link as HTMLLinkElement;
        linkElement.media = 'print';
        linkElement.onload = () => {
          linkElement.media = 'all';
        };
      });
    };

    // 5. Implement progressive enhancement
    const progressiveEnhancement = () => {
      // Core functionality first, enhancements later
      document.documentElement.classList.add('js-enabled');
      
      // Mark when critical resources are loaded
      window.addEventListener('load', () => {
        document.documentElement.classList.add('resources-loaded');
      });
    };

    // Execute optimizations in order
    const runOptimizations = () => {
      progressiveEnhancement();
      removeUnusedAssets();
      
      // Defer non-critical scripts
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          deferFacebookPixel();
          deferLovableScript();
          optimizeChunkLoading();
        });
      } else {
        setTimeout(() => {
          deferFacebookPixel();
          deferLovableScript();
          optimizeChunkLoading();
        }, 1000);
      }
    };

    // Start optimization after component mount
    runOptimizations();

    // Cleanup function
    return () => {
      // Remove event listeners if needed
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.removeEventListener(event, () => {}, { passive: true } as any);
      });
    };
  }, []);

  return <>{children}</>;
};

export default ScriptOptimizer;