// Bundle analysis and optimization utilities
export const bundleAnalyzer = {
  // Analyze which imports are actually used
  analyzeImports: () => {
    if (typeof window === 'undefined') return;
    
    console.group('Bundle Analysis');
    
    // Check for unused CSS
    const unusedCSS = Array.from(document.styleSheets).map(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        return rules.filter(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selectorText = (rule as CSSStyleRule).selectorText;
            return !document.querySelector(selectorText);
          }
          return false;
        });
      } catch (e) {
        return [];
      }
    }).flat();
    
    console.log('Potentially unused CSS rules:', unusedCSS.length);
    
    // Check for large DOM elements
    const largeElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.children.length > 50
    );
    
    console.log('Elements with >50 children (DOM complexity):', largeElements.length);
    
    // Check bundle sizes (if available)
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as any[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      console.log('JavaScript files:', jsResources.length);
      console.log('CSS files:', cssResources.length);
      
      // Log largest resources
      const largeResources = resources
        .filter(r => r.transferSize && r.transferSize > 100000) // >100KB
        .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
        .slice(0, 10);
        
      console.table(largeResources.map(r => ({
        name: r.name.split('/').pop(),
        size: `${Math.round((r.transferSize || 0) / 1024)}KB`,
        type: r.name.split('.').pop()
      })));
    }
    
    console.groupEnd();
  },

  // Check for mobile optimization issues
  mobileAudit: () => {
    if (typeof window === 'undefined') return;
    
    console.group('Mobile Audit');
    
    // Check touch target sizes
    const touchTargets = document.querySelectorAll('button, a, input, select, [role="button"]');
    const smallTargets = Array.from(touchTargets).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    });
    
    console.log('Elements below 44px touch target:', smallTargets.length);
    if (smallTargets.length > 0) {
      console.table(smallTargets.slice(0, 10).map(el => ({
        tag: el.tagName,
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
        classes: el.className
      })));
    }
    
    // Check font sizes that might cause zoom on iOS
    const textElements = document.querySelectorAll('input, select, textarea');
    const smallFonts = Array.from(textElements).filter(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseInt(style.fontSize);
      return fontSize < 16;
    });
    
    console.log('Input elements <16px (may zoom on iOS):', smallFonts.length);
    
    // Check viewport configuration
    const viewport = document.querySelector('meta[name="viewport"]');
    const viewportContent = viewport?.getAttribute('content') || '';
    const hasProperViewport = viewportContent.includes('width=device-width') && 
                             viewportContent.includes('initial-scale=1');
    
    console.log('Proper viewport meta tag:', hasProperViewport);
    
    // Check for excessive DOM depth
    const maxDepth = Array.from(document.querySelectorAll('*')).reduce((max, el) => {
      let depth = 0;
      let parent = el.parentElement;
      while (parent) {
        depth++;
        parent = parent.parentElement;
      }
      return Math.max(max, depth);
    }, 0);
    
    console.log('Maximum DOM depth:', maxDepth);
    console.log('Recommended: <15 levels');
    
    console.groupEnd();
  },

  // Performance metrics
  measurePerformance: () => {
    if (typeof window === 'undefined') return;
    
    console.group('Performance Metrics');
    
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        console.log('LCP (Largest Contentful Paint):', Math.round(lcp.startTime), 'ms');
        console.log('LCP Target: <2500ms (Good), <4000ms (Needs Improvement)');
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          console.log('FID (First Input Delay):', Math.round(entry.processingStart - entry.startTime), 'ms');
          console.log('FID Target: <100ms (Good), <300ms (Needs Improvement)');
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS (Cumulative Layout Shift):', clsValue.toFixed(3));
        console.log('CLS Target: <0.1 (Good), <0.25 (Needs Improvement)');
      }).observe({ entryTypes: ['layout-shift'] });
    }
    
    // DOM stats
    const domStats = {
      totalElements: document.querySelectorAll('*').length,
      textNodes: (() => {
        let count = 0;
        const walker = document.createTreeWalker(
          document.body, 
          NodeFilter.SHOW_TEXT
        );
        while (walker.nextNode()) count++;
        return count;
      })(),
      images: document.images.length,
      scripts: document.scripts.length,
      stylesheets: document.styleSheets.length
    };
    
    console.table(domStats);
    console.log('DOM Target: <1500 elements for good performance');
    
    console.groupEnd();
  }
};

// Auto-run analysis in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    bundleAnalyzer.analyzeImports();
    bundleAnalyzer.mobileAudit();
    bundleAnalyzer.measurePerformance();
  }, 2000);
}