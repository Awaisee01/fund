// Critical CSS utility for extracting above-the-fold styles
export const criticalCssExtractor = {
  // Extract critical CSS for above-the-fold content
  extractCritical: () => {
    const criticalSelectors = [
      // Navigation
      '.nav-container',
      '.navigation',
      'nav',
      
      // Hero sections
      '.hero-section',
      '.hero-content',
      '.hero-title',
      '.hero-overlay',
      '.hero-image',
      
      // Form elements above fold
      'form[class*="hero"]',
      'form[class*="native"]',
      '.form-container',
      
      // Critical layout
      '.container',
      '.max-w-7xl',
      '.mx-auto',
      '.grid',
      '.flex',
      
      // Typography
      'h1', 'h2', 'p',
      '.text-4xl', '.text-6xl',
      '.font-bold',
      
      // Buttons and CTAs
      'button',
      '.btn',
      '.button',
      
      // Loading states
      '.loading',
      '.loaded',
      '.skeleton'
    ];
    
    return criticalSelectors;
  },
  
  // Defer non-critical CSS
  deferNonCritical: () => {
    const nonCriticalSelectors = [
      // Below fold sections
      '.footer',
      '.testimonials',
      '.features',
      '.process-section',
      '.eligibility-section',
      
      // Modal and overlay components
      '.modal',
      '.dialog',
      '.popover',
      '.tooltip',
      
      // Admin components
      '.admin',
      '.dashboard',
      
      // Non-essential animations
      '.animate-',
      '.transition-',
      
      // Print styles
      '@media print'
    ];
    
    return nonCriticalSelectors;
  }
};

// Load non-critical CSS after page load
export const loadNonCriticalCSS = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Add non-critical styles dynamically
      const style = document.createElement('style');
      style.textContent = `
        /* Below-the-fold animations */
        .lazy-load {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .lazy-load.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Performance optimizations */
        .will-change-transform {
          will-change: transform;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(style);
    });
  }
};