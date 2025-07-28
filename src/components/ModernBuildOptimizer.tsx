import { useEffect } from 'react';

const ModernBuildOptimizer = () => {
  useEffect(() => {
    // 1. Detect modern browser capabilities
    const isModernBrowser = () => {
      return (
        'noModule' in HTMLScriptElement.prototype &&
        window.IntersectionObserver &&
        window.Promise &&
        window.fetch &&
        Array.prototype.includes &&
        String.prototype.startsWith
      );
    };

    // 2. Optimize for modern browsers
    if (isModernBrowser()) {
      // Add modern browser class for CSS optimization
      document.documentElement.classList.add('modern-browser');
      
      // Use native ES6+ features without polyfills
      const optimizeForModern = () => {
        // Enable modern JavaScript features
        document.documentElement.setAttribute('data-js-target', 'es2022');
        
        // Remove legacy polyfills if present
        const polyfills = document.querySelectorAll('script[src*="polyfill"]');
        polyfills.forEach(script => script.remove());
        
        // Use modern CSS features
        document.documentElement.style.setProperty('--supports-modern', '1');
      };

      optimizeForModern();
    } else {
      // Mark as legacy browser for graceful degradation
      document.documentElement.classList.add('legacy-browser');
    }

    // 3. Optimize font loading for modern browsers
    const optimizeFontLoading = () => {
      if ('fonts' in document) {
        // Use modern font loading API
        const fontPromises = [
          'Inter 400',
          'Inter 500', 
          'Inter 600',
          'Inter 700'
        ].map(font => {
          return (document as any).fonts.load(font);
        });

        Promise.all(fontPromises).then(() => {
          document.documentElement.classList.add('fonts-loaded');
        });
      }
    };

    optimizeFontLoading();

    // 4. Remove unused JavaScript features detection
    const removeUnusedFeatures = () => {
      // Remove @babel/plugin-transform-classes if not needed
      // Remove @babel/plugin-transform-spread if not needed
      // These should be handled at build time, but we can optimize runtime
      
      // Use native methods where possible
      if (Array.from && Array.prototype.filter && Array.prototype.find) {
        document.documentElement.setAttribute('data-native-arrays', 'true');
      }
      
      if (String.prototype.startsWith && String.prototype.includes) {
        document.documentElement.setAttribute('data-native-strings', 'true');
      }
    };

    removeUnusedFeatures();
  }, []);

  return null;
};

export default ModernBuildOptimizer;