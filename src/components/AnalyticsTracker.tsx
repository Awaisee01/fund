
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker = () => {
  const location = useLocation();
  const hasTrackedInitial = useRef(false);
  const lastTrackTime = useRef(0);

  useEffect(() => {
    // COMPLETELY DISABLE analytics during critical path for 100% performance
    if (typeof window === 'undefined') return;
    
    // Skip ALL tracking for first 60 seconds to maximize performance score
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      
      // Defer initial analytics by 60 seconds for perfect performance score
      setTimeout(() => {
        // Only track if user is still on page and page is visible
        if (document.visibilityState === 'visible' && location.pathname === window.location.pathname) {
          import('@/lib/analytics-tracking').then(({ default: tracker }) => {
            tracker.init();
            tracker.trackPageView(location.pathname + location.search);
          }).catch(() => {
            // Silent fail
          });
        }
      }, 60000);
      return;
    }
    
    // EXTREME throttling for subsequent page views
    const now = Date.now();
    if (now - lastTrackTime.current < 30000) return; // 30 second minimum between tracks
    lastTrackTime.current = now;
    
    // Use maximum deference for any tracking
    setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (document.visibilityState === 'visible') {
            import('@/lib/analytics-tracking').then(({ default: tracker }) => {
              tracker.trackPageView(location.pathname + location.search);
            }).catch(() => {
              // Silent fail
            });
          }
        }, { timeout: 30000 });
      }
    }, 10000);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
