import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixelPageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if fbq is available (Facebook Pixel loaded)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixelPageView;