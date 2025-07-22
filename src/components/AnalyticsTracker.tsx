import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import tracker from '@/lib/analytics-tracking';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    tracker.trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // This component doesn't render anything
  return null;
};

export default AnalyticsTracker;