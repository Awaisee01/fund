import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals for performance tracking
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        console.log('LCP:', lastEntry.startTime);
        
        // Target: < 2.5s for good LCP
        if (lastEntry.startTime > 2500) {
          console.warn('LCP is slow:', lastEntry.startTime, 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const perfEntry = entry as PerformanceEventTiming;
          if (perfEntry.processingStart) {
            const fid = perfEntry.processingStart - perfEntry.startTime;
            console.log('FID:', fid);
            
            // Target: < 100ms for good FID
            if (fid > 100) {
              console.warn('FID is slow:', fid, 'ms');
            }
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
        
        // Target: < 0.1 for good CLS
        if (clsValue > 0.1) {
          console.warn('CLS is high:', clsValue);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitor resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.duration > 1000) {
            console.warn('Slow resource:', resourceEntry.name, resourceEntry.duration, 'ms');
          }
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Monitor navigation timing using performance.timing
    const logNavigationTiming = () => {
      if (performance.timing) {
        const timing = performance.timing;
        console.log('Navigation timing:', {
          'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
          'TCP Connection': timing.connectEnd - timing.connectStart,
          'Server Response': timing.responseEnd - timing.requestStart,
          'DOM Processing': timing.domContentLoadedEventStart - timing.responseEnd,
          'Total Load Time': timing.loadEventEnd - timing.navigationStart
        });
      }
    };
    
    // Log navigation timing when page loads
    if (document.readyState === 'complete') {
      logNavigationTiming();
    } else {
      window.addEventListener('load', logNavigationTiming);
    }

  }, []);

  return null;
}

export default PerformanceMonitor;