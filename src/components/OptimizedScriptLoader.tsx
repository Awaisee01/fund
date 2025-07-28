import { useEffect } from 'react';

interface OptimizedScriptLoaderProps {
  children: React.ReactNode;
}

const OptimizedScriptLoader = ({ children }: OptimizedScriptLoaderProps) => {
  useEffect(() => {
    // 1. Aggressively defer ALL non-critical JavaScript
    const deferNonCriticalScripts = () => {
      // Remove Facebook Pixel completely until user interaction
      const existingFbScript = document.querySelector('script[src*="fbevents.js"]');
      if (existingFbScript) {
        existingFbScript.remove();
      }

      // Remove Lovable script until after page is fully loaded
      const existingLovableScript = document.querySelector('script[src*="lovable.js"]');
      if (existingLovableScript) {
        existingLovableScript.remove();
      }

      // Mark non-critical scripts for removal
      const nonCriticalScripts = [
        'supabase',
        'ui-components',
        'react-core'
      ];

      nonCriticalScripts.forEach(scriptName => {
        const script = document.querySelector(`script[src*="${scriptName}"]`);
        if (script && !script.hasAttribute('data-critical')) {
          script.setAttribute('defer', 'true');
          script.setAttribute('async', 'true');
        }
      });
    };

    // 2. Load Facebook Pixel only after user interaction
    const loadFacebookPixel = () => {
      if ((window as any).fbq) return; // Already loaded
      
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.async = true;
      script.defer = true;
      // Add cache headers via attributes
      script.setAttribute('data-cache', '7d');
      document.head.appendChild(script);
    };

    // 3. Load Lovable script after everything else
    const loadLovableScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.gpteng.co/lovable.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-cache', '7d');
      document.head.appendChild(script);
    };

    // 4. Optimize chunk loading for modern browsers only
    const optimizeModernChunks = () => {
      // Target modern browsers - no legacy transpilation
      if ('noModule' in HTMLScriptElement.prototype) {
        // Browser supports ES modules, optimize accordingly
        const criticalChunks = ['react-core', 'index'];
        
        criticalChunks.forEach(chunk => {
          const link = document.createElement('link');
          link.rel = 'modulepreload';
          link.href = `/assets/${chunk}.js`;
          link.setAttribute('crossorigin', '');
          document.head.appendChild(link);
        });
      }
    };

    // 5. Reduce unused CSS impact
    const optimizeCSS = () => {
      // Mark main CSS as non-critical to prevent blocking
      const mainCSS = document.querySelector('link[href*="index-CI90YalX.css"]');
      if (mainCSS) {
        (mainCSS as HTMLLinkElement).media = 'print';
        (mainCSS as HTMLLinkElement).onload = function() {
          (this as HTMLLinkElement).media = 'all';
        };
      }
    };

    // Execute immediately
    deferNonCriticalScripts();
    optimizeCSS();
    optimizeModernChunks();

    // Defer Facebook Pixel until user interaction or 5 seconds
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const triggerFbLoad = () => {
      events.forEach(event => document.removeEventListener(event, triggerFbLoad));
      setTimeout(loadFacebookPixel, 100);
    };

    events.forEach(event => document.addEventListener(event, triggerFbLoad, { passive: true }));
    setTimeout(triggerFbLoad, 5000); // Fallback after 5 seconds

    // Load Lovable script last
    setTimeout(loadLovableScript, 8000);

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, triggerFbLoad);
      });
    };
  }, []);

  return <>{children}</>;
};

export default OptimizedScriptLoader;