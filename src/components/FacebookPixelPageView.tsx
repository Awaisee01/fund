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
    // Load Facebook Pixel only once and track page views
    if (typeof window !== 'undefined') {
      if (!window.fbq) {
        // Initialize Facebook Pixel if not loaded
        window.fbq = window.fbq || function(){(window.fbq.q = window.fbq.q || []).push(arguments)};
        window.fbq.q = window.fbq.q || [];
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.onload = () => {
          window.fbq('init', '1423013825182147');
          window.fbq('track', 'PageView');
        };
        document.head.appendChild(script);
      } else {
        // Pixel already loaded, just track page view
        window.fbq('track', 'PageView');
      }
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixelPageView;