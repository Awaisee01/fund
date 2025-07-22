
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only load analytics in browser environment
    if (typeof window === 'undefined') return;
    
    // Dynamically import and initialize analytics
    import('@/lib/analytics-tracking').then(({ default: tracker }) => {
      // Ensure tracker is initialized before tracking
      tracker.init();
      tracker.trackPageView(location.pathname + location.search);
    }).catch(error => {
      console.log('Analytics loading failed:', error);
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
