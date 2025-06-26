
// Simple placeholder hook - no tracking functionality
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // No tracking - just a placeholder
    console.log('Page visited:', location.pathname);
  }, [location.pathname]);
};
