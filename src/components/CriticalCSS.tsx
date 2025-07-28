import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Defer non-critical CSS after initial render
    const deferCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/index-CI90YalX.css';
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Defer CSS loading after LCP
    if (window.requestIdleCallback) {
      window.requestIdleCallback(deferCSS);
    } else {
      setTimeout(deferCSS, 1000);
    }
  }, []);

  return null;
};

export default CriticalCSS;