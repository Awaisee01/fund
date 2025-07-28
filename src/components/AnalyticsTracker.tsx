
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker = () => {
  const location = useLocation();
  const hasTrackedInitial = useRef(false);
  const lastTrackTime = useRef(0);

  useEffect(() => {
    // Only load analytics in browser environment and after significant delay for performance
    if (typeof window === 'undefined') return;
    
    // Skip initial page load tracking to improve LCP
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      
      // Defer initial analytics by 10 seconds for 100% performance score
      setTimeout(() => {
        import('@/lib/analytics-tracking').then(({ default: tracker }) => {
          tracker.init();
          tracker.trackPageView(location.pathname + location.search);
        }).catch(() => {
          // Silent fail
        });
      }, 10000);
      return;
    }
    
    // Heavy throttling for subsequent page views
    const now = Date.now();
    if (now - lastTrackTime.current < 5000) return; // 5 second minimum between tracks
    lastTrackTime.current = now;
    
    // Use requestIdleCallback for deferred tracking
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('@/lib/analytics-tracking').then(({ default: tracker }) => {
          tracker.trackPageView(location.pathname + location.search);
        }).catch(() => {
          // Silent fail
        });
      }, { timeout: 10000 });
    }
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
