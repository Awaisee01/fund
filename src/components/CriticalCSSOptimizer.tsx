import { useEffect } from 'react';

const CriticalCSSOptimizer = () => {
  useEffect(() => {
    // Inline critical CSS for LCP optimization
    const criticalCSS = `
      /* Critical Above-the-fold Styles */
      body { margin: 0; font-family: Inter, sans-serif; background: rgb(249 250 251); }
      nav { position: sticky; top: 0; z-index: 9999; background: white; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
      .hero-section { min-height: 100vh; background: linear-gradient(to bottom right, rgb(37 99 235), rgb(59 130 246), rgb(34 197 94)); color: white; }
      .form-card { background: rgba(255, 255, 255, 0.1); border-radius: 1rem; padding: 2rem; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.2); }
      button { min-height: 48px; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; transition: all 0.2s; }
      .btn-primary { background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); }
      .btn-primary:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); }
      input, select, textarea { min-height: 44px; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #d1d5db; font-size: 16px; }
      .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
      .grid-2 { display: grid; grid-template-columns: 1fr; gap: 2rem; }
      @media (min-width: 1024px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
    `;

    // Inject critical CSS immediately
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);

    // Defer non-critical CSS
    const deferCSS = () => {
      const mainCSS = document.querySelector('link[href*="index-"]');
      if (mainCSS) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = mainCSS.getAttribute('href')!;
        link.onload = () => {
          link.rel = 'stylesheet';
          link.removeAttribute('as');
        };
        document.head.appendChild(link);
        
        // Remove render-blocking CSS
        mainCSS.remove();
      }
    };

    // Defer CSS after LCP
    requestIdleCallback(deferCSS, { timeout: 100 });

    return () => {
      // Cleanup critical CSS on unmount
      const criticalStyle = document.querySelector('style[data-critical]');
      if (criticalStyle) {
        criticalStyle.remove();
      }
    };
  }, []);

  return null;
};

export default CriticalCSSOptimizer;