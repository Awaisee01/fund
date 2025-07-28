import { useEffect } from 'react';

interface CriticalCSSLoaderProps {
  children: React.ReactNode;
}

const CriticalCSSLoader = ({ children }: CriticalCSSLoaderProps) => {
  useEffect(() => {
    // Load non-critical CSS asynchronously after critical render
    const loadNonCriticalCSS = () => {
      const existingLink = document.querySelector('link[href*="index-"]');
      if (!existingLink) {
        // Find the main CSS file dynamically
        const scripts = Array.from(document.scripts);
        const mainScript = scripts.find(script => script.src.includes('index-'));
        
        if (mainScript) {
          const cssPath = mainScript.src.replace(/index-[^.]+\.js$/, 'index-*.css');
          
          // Create preload link
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'style';
          preloadLink.href = cssPath;
          preloadLink.onload = () => {
            // Convert to stylesheet after preload
            preloadLink.rel = 'stylesheet';
            preloadLink.media = 'all';
          };
          
          document.head.appendChild(preloadLink);
        }
      }
    };

    // Load after critical content renders
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadNonCriticalCSS, { timeout: 1000 });
    } else {
      setTimeout(loadNonCriticalCSS, 100);
    }
  }, []);

  return <>{children}</>;
};

export default CriticalCSSLoader;