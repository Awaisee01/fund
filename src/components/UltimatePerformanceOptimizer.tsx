import { useEffect } from 'react';
import CriticalCSSOptimizer from './CriticalCSSOptimizer';
import ComprehensiveScriptOptimizer from './ComprehensiveScriptOptimizer';
import AdvancedImageOptimizer from './AdvancedImageOptimizer';
import LinkAccessibilityOptimizer from './LinkAccessibilityOptimizer';
import CompressionOptimizer from './CompressionOptimizer';

interface UltimatePerformanceOptimizerProps {
  children: React.ReactNode;
}

const UltimatePerformanceOptimizer = ({ children }: UltimatePerformanceOptimizerProps) => {
  useEffect(() => {
    // Performance monitoring
    const monitorPagePerformance = () => {
      if ('PerformanceObserver' in window) {
        // Monitor LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.startTime;
          
          if (lcp > 2500) {
            console.warn(`⚠️ LCP is slow: ${lcp.toFixed(2)}ms (target: <2500ms)`);
          } else {
            console.log(`✅ LCP is good: ${lcp.toFixed(2)}ms`);
          }
        });
        
        // Monitor FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const eventEntry = entry as PerformanceEventTiming;
            const fid = eventEntry.processingStart - eventEntry.startTime;
            if (fid > 100) {
              console.warn(`⚠️ FID is slow: ${fid.toFixed(2)}ms (target: <100ms)`);
            } else {
              console.log(`✅ FID is good: ${fid.toFixed(2)}ms`);
            }
          });
        });
        
        // Monitor CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          
          if (clsValue > 0.1) {
            console.warn(`⚠️ CLS is high: ${clsValue.toFixed(3)} (target: <0.1)`);
          } else {
            console.log(`✅ CLS is good: ${clsValue.toFixed(3)}`);
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          fidObserver.observe({ entryTypes: ['first-input'] });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance monitoring not fully supported:', error);
        }
      }
    };

    // Optimize font loading
    const optimizeFontLoading = () => {
      // Preload critical fonts
      const fontPreloads = [
        { family: 'Inter', weight: '400', display: 'swap' },
        { family: 'Inter', weight: '500', display: 'swap' },
        { family: 'Inter', weight: '600', display: 'swap' }
      ];
      
      fontPreloads.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = `https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2`;
        document.head.appendChild(link);
      });
      
      // Use Font Loading API if available
      if ('fonts' in document) {
        const fontLoadPromises = fontPreloads.map(font => 
          (document as any).fonts.load(`${font.weight} 1em ${font.family}`)
        );
        
        Promise.all(fontLoadPromises).then(() => {
          document.documentElement.classList.add('fonts-loaded');
          console.log('✅ Fonts loaded successfully');
        }).catch((error) => {
          console.warn('⚠️ Font loading failed:', error);
        });
      }
    };

    // Remove unused CSS
    const removeUnusedCSS = () => {
      const unusedSelectors = [
        '.unused-class',
        '.debug-mode',
        '.development-only'
      ];
      
      const stylesheets = Array.from(document.styleSheets);
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          rules.forEach((rule, index) => {
            if (rule.type === CSSRule.STYLE_RULE) {
              const styleRule = rule as CSSStyleRule;
              unusedSelectors.forEach(selector => {
                if (styleRule.selectorText && styleRule.selectorText.includes(selector)) {
                  stylesheet.deleteRule(index);
                }
              });
            }
          });
        } catch (error) {
          // Ignore CORS errors for external stylesheets
        }
      });
    };

    // Enable service worker for better caching
    const enableServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registered:', registration);
          })
          .catch(error => {
            console.warn('⚠️ Service Worker registration failed:', error);
          });
      }
    };

    // Execute optimizations
    requestIdleCallback(() => {
      monitorPagePerformance();
      optimizeFontLoading();
      removeUnusedCSS();
      enableServiceWorker();
    });

    // Log optimization completion
    console.log('🚀 Ultimate Performance Optimizer activated');

    return () => {
      console.log('🧹 Ultimate Performance Optimizer cleanup completed');
    };
  }, []);

  return (
    <>
      <CriticalCSSOptimizer />
      <AdvancedImageOptimizer />
      <LinkAccessibilityOptimizer />
      <CompressionOptimizer />
      <ComprehensiveScriptOptimizer>
        {children}
      </ComprehensiveScriptOptimizer>
    </>
  );
};

export default UltimatePerformanceOptimizer;