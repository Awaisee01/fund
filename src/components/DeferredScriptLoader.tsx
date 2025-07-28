import { useEffect } from 'react';

interface DeferredScriptLoaderProps {
  children: React.ReactNode;
}

const DeferredScriptLoader = ({ children }: DeferredScriptLoaderProps) => {
  useEffect(() => {
    // Defer third-party script loading until after critical rendering
    const loadDeferredScripts = () => {
      // Load GPT/Lovable script after critical path
      const loadLovableScript = () => {
        if (document.querySelector('script[src*="lovable.js"]')) return;
        
        const script = document.createElement('script');
        script.src = 'https://cdn.gpteng.co/lovable.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.fetchPriority = 'low';
        
        // Add error handling
        script.onerror = () => {
          console.warn('Lovable script failed to load');
        };
        
        document.head.appendChild(script);
      };

      // Use requestIdleCallback for optimal timing
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadLovableScript, { timeout: 3000 });
      } else {
        setTimeout(loadLovableScript, 2000);
      }
    };

    // Only load after critical resources are ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadDeferredScripts);
    } else {
      loadDeferredScripts();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', loadDeferredScripts);
    };
  }, []);

  return <>{children}</>;
};

export default DeferredScriptLoader;