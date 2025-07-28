// Critical CSS Extractor for better LCP
export function extractCriticalCSS() {
  const criticalSelectors = [
    // Layout fundamentals
    'html', 'body', '*',
    '.min-h-screen', '.flex', '.flex-col', '.relative',
    
    // Navigation
    'nav', '.bg-white', '.shadow-lg', '.sticky', '.top-0', '.z-50',
    '.max-w-7xl', '.mx-auto', '.px-4', '.justify-between', '.items-center',
    
    // Hero section
    '.bg-gradient-to-br', '.from-blue-600', '.via-blue-700', '.to-green-600',
    '.text-white', '.overflow-hidden', '.absolute', '.inset-0',
    
    // Images
    'img', '.w-full', '.h-full', '.object-cover', '.object-contain',
    
    // Loading states
    '.animate-pulse', '.bg-gray-50', '.bg-gray-300', '.rounded'
  ];

  return criticalSelectors.join(',');
}

// Performance Budget Monitor
export class PerformanceBudget {
  public budgets: Record<string, number>;
  public violations: Array<{metric: string, value: number, budget: number, severity: string}>;

  constructor() {
    this.budgets = {
      LCP: 2500, // ms
      FID: 100,  // ms
      CLS: 0.1,  // score
      TBT: 300,  // ms
      FCP: 1800  // ms
    };
    
    this.violations = [];
  }

  monitor() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1];
      
      if (lcp.startTime > this.budgets.LCP) {
        this.violations.push({
          metric: 'LCP',
          value: lcp.startTime,
          budget: this.budgets.LCP,
          severity: 'high'
        });
        console.warn(`⚠️ LCP Budget Violation: ${lcp.startTime.toFixed(2)}ms > ${this.budgets.LCP}ms`);
      } else {
        console.log(`✅ LCP within budget: ${lcp.startTime.toFixed(2)}ms`);
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        
        if (fid > this.budgets.FID) {
          this.violations.push({
            metric: 'FID',
            value: fid,
            budget: this.budgets.FID,
            severity: 'medium'
          });
          console.warn(`⚠️ FID Budget Violation: ${fid.toFixed(2)}ms > ${this.budgets.FID}ms`);
        }
      }
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // Monitor CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (clsValue > this.budgets.CLS) {
        this.violations.push({
          metric: 'CLS',
          value: clsValue,
          budget: this.budgets.CLS,
          severity: 'high'
        });
        console.warn(`⚠️ CLS Budget Violation: ${clsValue.toFixed(3)} > ${this.budgets.CLS}`);
      }
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  getViolations() {
    return this.violations;
  }

  getScore() {
    const total = Object.keys(this.budgets).length;
    const violations = this.violations.length;
    return Math.max(0, (total - violations) / total * 100);
  }
}

// Resource Loading Optimizer
export class ResourceOptimizer {
  public criticalResources: Set<string>;

  constructor() {
    this.criticalResources = new Set([
      '/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png',
      '/lovable-uploads/aceccd77-e1e4-46e3-9541-75492bfd3619.png'
    ]);
  }

  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const isCritical = this.criticalResources.has(img.src) || index === 0;
      
      if (isCritical) {
        // Critical images for LCP
        img.setAttribute('fetchpriority', 'high');
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync');
      } else {
        // Non-critical images
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.setAttribute('fetchpriority', 'low');
      }

      // Add intersection observer for lazy images
      if (!isCritical && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLImageElement;
              target.setAttribute('loading', 'eager');
              observer.unobserve(target);
            }
          });
        }, { rootMargin: '50px' });
        
        observer.observe(img);
      }
    });
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);

    // Preload critical images
    this.criticalResources.forEach(src => {
      const imagePreload = document.createElement('link');
      imagePreload.rel = 'preload';
      imagePreload.href = src;
      imagePreload.as = 'image';
      imagePreload.fetchPriority = 'high';
      document.head.appendChild(imagePreload);
    });
  }
}

export default {
  extractCriticalCSS,
  PerformanceBudget,
  ResourceOptimizer
};