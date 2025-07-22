import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // LCP (Largest Contentful Paint)
      const observeLCP = (list: PerformanceObserverEntryList) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        
        if (lastEntry && lastEntry.startTime < 2500) {
          console.log('✅ Good LCP:', lastEntry.startTime);
        } else {
          console.warn('⚠️ Poor LCP:', lastEntry?.startTime);
        }
        
        // Send to analytics if available
        if (window.gtag && lastEntry) {
          window.gtag('event', 'lcp', {
            value: Math.round(lastEntry.startTime),
            event_category: 'performance'
          });
        }
      };

      // FCP (First Contentful Paint)
      const observeFCP = (list: PerformanceObserverEntryList) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        
        if (lastEntry && lastEntry.startTime < 1800) {
          console.log('✅ Good FCP:', lastEntry.startTime);
        } else {
          console.warn('⚠️ Poor FCP:', lastEntry?.startTime);
        }
        
        if (window.gtag && lastEntry) {
          window.gtag('event', 'fcp', {
            value: Math.round(lastEntry.startTime),
            event_category: 'performance'
          });
        }
      };

      // FID (First Input Delay) 
      const observeFID = (list: PerformanceObserverEntryList) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            if (fid < 100) {
              console.log('✅ Good FID:', fid);
            } else {
              console.warn('⚠️ Poor FID:', fid);
            }
            
            if (window.gtag) {
              window.gtag('event', 'fid', {
                value: Math.round(fid),
                event_category: 'performance'
              });
            }
          }
        });
      };

      // CLS (Cumulative Layout Shift)
      const observeCLS = (list: PerformanceObserverEntryList) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (clsValue < 0.1) {
          console.log('✅ Good CLS:', clsValue);
        } else {
          console.warn('⚠️ Poor CLS:', clsValue);
        }
        
        if (window.gtag && clsValue > 0) {
          window.gtag('event', 'cls', {
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'performance'
          });
        }
      };

      // Setup observers
      if ('PerformanceObserver' in window) {
        try {
          // LCP Observer
          const lcpObserver = new PerformanceObserver(observeLCP);
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FCP Observer  
          const fcpObserver = new PerformanceObserver(observeFCP);
          fcpObserver.observe({ entryTypes: ['paint'] });

          // FID Observer
          const fidObserver = new PerformanceObserver(observeFID);
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS Observer
          const clsObserver = new PerformanceObserver(observeCLS);
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Cleanup
          return () => {
            lcpObserver.disconnect();
            fcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
          };
        } catch (e) {
          console.warn('Performance monitoring not supported');
        }
      }
    };

    // Observe web vitals after a delay to ensure page is interactive
    const cleanup = observeWebVitals();
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;