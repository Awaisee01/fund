import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsTracker from '@/lib/analytics-tracking';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analyticsTracker.trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  // This component doesn't render anything
  return null;
};

export default AnalyticsTracker;