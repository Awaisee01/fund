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
      // Load additional stylesheets for below-the-fold content
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/src/styles/deferred.css';
      (link as any).media = 'print';
      link.onload = function() {
        (this as any).media = 'all';
      };
      document.head.appendChild(link);
    });
  }
};