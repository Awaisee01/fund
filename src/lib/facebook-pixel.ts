// Optimized Facebook Pixel loading for better performance
export function initializeFacebookPixel() {
  // Only load on modern browsers to avoid legacy overhead
  if (!window.IntersectionObserver || !window.Promise) {
    return;
  }

  // Load Facebook Pixel asynchronously to prevent blocking
  const loadFacebookPixel = () => {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  // Initialize after page load to prioritize LCP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFacebookPixel);
  } else {
    loadFacebookPixel();
  }

  // Initialize fbq function
  window.fbq = function() {
    (window.fbq as any).callMethod ? 
      (window.fbq as any).callMethod.apply(window.fbq, arguments) : 
      (window.fbq as any).queue.push(arguments);
  };
  
  if (!(window as any)._fbq) (window as any)._fbq = window.fbq;
  (window.fbq as any).push = window.fbq;
  (window.fbq as any).loaded = true;
  (window.fbq as any).version = '2.0';
  (window.fbq as any).queue = [];
  
  // Initialize with your pixel ID
  window.fbq('init', '1423013825182147');
  window.fbq('track', 'PageView');
}

// Declare global types for TypeScript
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}