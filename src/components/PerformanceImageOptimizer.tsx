import { useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';

// Critical Image Optimizer for LCP improvement
export function CriticalImageOptimizer() {
  useEffect(() => {
    // Optimize critical images immediately for LCP
    const optimizeCriticalImages = () => {
      // Target ECO4 hero images specifically
      const criticalSelectors = [
        'img[src*="1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade"]',
        'img[src*="aceccd77-e1e4-46e3-9541-75492bfd3619"]',
        'img[loading="eager"]',
        'img[fetchpriority="high"]'
      ];
      
      criticalSelectors.forEach(selector => {
        const images = document.querySelectorAll(selector);
        images.forEach((img: HTMLImageElement) => {
          // Force high priority loading
          img.setAttribute('fetchpriority', 'high');
          img.setAttribute('loading', 'eager');
          img.setAttribute('decoding', 'sync');
          
          // Add intersection observer for immediate loading
          if ('IntersectionObserver' in window) {
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
      });
    };

    // Run immediately and on DOM changes
    optimizeCriticalImages();
    
    // Watch for dynamic content
    const observer = new MutationObserver(() => {
      optimizeCriticalImages();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

// Lazy Loading Optimizer for below-fold content
export function LazyLoadOptimizer() {
  useEffect(() => {
    // Optimize non-critical images for lazy loading
    const optimizeBelowFoldImages = () => {
      const allImages = document.querySelectorAll('img');
      
      allImages.forEach((img: HTMLImageElement, index) => {
        // Skip if already optimized or is critical
        if (img.hasAttribute('data-optimized') || 
            img.getAttribute('fetchpriority') === 'high' ||
            img.getAttribute('loading') === 'eager') {
          return;
        }
        
        // Apply lazy loading to non-critical images
        if (index > 0) { // First image is usually hero, keep it eager
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
          img.setAttribute('fetchpriority', 'low');
        }
        
        img.setAttribute('data-optimized', 'true');
      });
    };

    // Delay to not interfere with critical image loading
    setTimeout(optimizeBelowFoldImages, 100);
    
    // Re-run when new images are added
    const observer = new MutationObserver(() => {
      setTimeout(optimizeBelowFoldImages, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

// Combined Performance Image Optimizer
export function PerformanceImageOptimizer() {
  return (
    <>
      <CriticalImageOptimizer />
      <LazyLoadOptimizer />
    </>
  );
}

export default PerformanceImageOptimizer;