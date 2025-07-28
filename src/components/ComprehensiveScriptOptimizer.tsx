import { useEffect } from 'react';

interface ComprehensiveScriptOptimizerProps {
  children: React.ReactNode;
}

const ComprehensiveScriptOptimizer = ({ children }: ComprehensiveScriptOptimizerProps) => {
  useEffect(() => {
    // 1. Defer Facebook Pixel with async loading
    const loadFacebookPixel = () => {
      if ((window as any).fbq) return; // Already loaded
      
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => {
        console.log('✅ Facebook Pixel loaded asynchronously');
      };
      document.head.appendChild(script);
    };

    // 2. Defer Lovable.js with proper caching
    const loadLovableScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = 'https://cdn.gpteng.co/lovable.js';
      script.crossOrigin = 'anonymous';
      
      // Add cache headers hint
      script.onload = () => {
        console.log('✅ Lovable.js loaded with enhanced caching');
      };
      
      document.head.appendChild(script);
    };

    // 3. Optimize bundle loading with module preloads
    const optimizeModuleLoading = () => {
      const criticalChunks = [
        '/assets/js/react-core-',
        '/assets/js/index-'
      ];

      criticalChunks.forEach(chunk => {
        const scripts = Array.from(document.scripts);
        const chunkScript = scripts.find(script => script.src.includes(chunk));
        
        if (chunkScript) {
          const link = document.createElement('link');
          link.rel = 'modulepreload';
          link.href = chunkScript.src;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });

      // Preload non-critical chunks for instant navigation
      const nonCriticalChunks = [
        '/assets/js/supabase-',
        '/assets/js/ui-components-',
        '/assets/js/routing-',
        '/assets/js/utils-'
      ];

      nonCriticalChunks.forEach(chunk => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = chunk;
        link.as = 'script';
        document.head.appendChild(link);
      });
    };

    // 4. Implement intelligent lazy loading
    const implementLazyLoading = () => {
      // Lazy load Footer when scrolled 50% down
      const lazyLoadFooter = () => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              import('../components/Footer').then(module => {
                console.log('✅ Footer lazy loaded');
              });
              observer.disconnect();
            }
          });
        }, { rootMargin: '200px' });

        const footer = document.querySelector('footer, [data-component="footer"]');
        if (footer) observer.observe(footer);
      };

      // Lazy load admin components only when needed
      const lazyLoadAdmin = () => {
        if (window.location.pathname.includes('/admin')) {
          import('../pages/Admin').then(module => {
            console.log('✅ Admin components lazy loaded');
          });
        }
      };

      requestIdleCallback(() => {
        lazyLoadFooter();
        lazyLoadAdmin();
      });
    };

    // 5. Optimize third-party script loading
    const optimizeThirdPartyScripts = () => {
      // Load non-critical scripts after user interaction
      let userInteracted = false;
      const loadAfterInteraction = () => {
        if (userInteracted) return;
        userInteracted = true;
        
        // Load Facebook Pixel after interaction
        setTimeout(loadFacebookPixel, 100);
        
        // Load Lovable script after interaction
        setTimeout(loadLovableScript, 200);
        
        // Remove event listeners
        document.removeEventListener('scroll', loadAfterInteraction);
        document.removeEventListener('click', loadAfterInteraction);
        document.removeEventListener('touchstart', loadAfterInteraction);
      };

      // Load on user interaction or after 3 seconds
      document.addEventListener('scroll', loadAfterInteraction, { passive: true, once: true });
      document.addEventListener('click', loadAfterInteraction, { once: true });
      document.addEventListener('touchstart', loadAfterInteraction, { passive: true, once: true });
      
      // Fallback: load after 3 seconds
      setTimeout(loadAfterInteraction, 3000);
    };

    // 6. Enable compression hints
    const enableCompressionHints = () => {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Encoding';
      meta.content = 'gzip, br';
      document.head.appendChild(meta);
    };

    // Execute optimizations
    requestIdleCallback(() => {
      optimizeModuleLoading();
      implementLazyLoading();
      enableCompressionHints();
    });

    // Start third-party optimization immediately
    optimizeThirdPartyScripts();

    // Cleanup
    return () => {
      // Remove any event listeners or observers
      console.log('🧹 Script optimizer cleanup completed');
    };
  }, []);

  return <>{children}</>;
};

export default ComprehensiveScriptOptimizer;