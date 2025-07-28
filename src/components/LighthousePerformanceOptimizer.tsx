import { useEffect } from 'react';

interface LighthousePerformanceOptimizerProps {
  children: React.ReactNode;
}

const LighthousePerformanceOptimizer = ({ children }: LighthousePerformanceOptimizerProps) => {
  useEffect(() => {
    // 1. Optimize LCP - Critical for 100% score
    const optimizeLCP = () => {
      // Preload hero image with highest priority
      const heroImage = document.querySelector('img[src*="1932c2a7"]') as HTMLImageElement;
      if (heroImage) {
        heroImage.setAttribute('fetchpriority', 'high');
        heroImage.setAttribute('loading', 'eager');
        heroImage.setAttribute('decoding', 'sync');
      }

      // Inline critical CSS is already handled
      // Ensure no render-blocking resources
      const criticalFonts = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      criticalFonts.forEach(font => {
        font.setAttribute('rel', 'preconnect');
      });
    };

    // 2. Optimize FID - Defer non-critical scripts
    const optimizeFID = () => {
      // Use passive event listeners
      const passiveEvents = ['scroll', 'touchstart', 'touchmove'];
      passiveEvents.forEach(event => {
        window.addEventListener(event, () => {}, { passive: true });
      });

      // Defer analytics and tracking
      setTimeout(() => {
        // Facebook Pixel and other third-party scripts
        if (typeof window !== 'undefined' && !(window as any).fbq) {
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/fbevents.js';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      }, 3000);
    };

    // 3. Optimize CLS - Prevent layout shifts
    const optimizeCLS = () => {
      // Ensure all images have dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])') as NodeListOf<HTMLImageElement>;
      images.forEach(img => {
        img.style.aspectRatio = '16/9';
        img.style.objectFit = 'cover';
      });

      // Reserve space for forms
      const forms = document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
      forms.forEach(form => {
        form.style.minHeight = '400px';
      });
    };

    // 4. Resource optimization
    const optimizeResources = () => {
      // Remove unused CSS (handled by build process)
      // Compress images (handled by Vite)
      
      // Optimize font loading
      const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
      if (fontLink && !fontLink.hasAttribute('rel')) {
        fontLink.setAttribute('rel', 'preconnect');
        fontLink.setAttribute('crossorigin', '');
      }
    };

    // 5. Bundle optimization
    const optimizeBundle = () => {
      // Tree-shaking is handled by Vite
      // Code splitting is handled by React.lazy
      
      // Preload critical routes
      const criticalRoutes = ['/eco4'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.setAttribute('fetchpriority', 'low');
        document.head.appendChild(link);
      });
    };

    // Execute optimizations immediately
    optimizeLCP();
    optimizeCLS();
    optimizeResources();

    // Defer non-critical optimizations
    requestAnimationFrame(() => {
      optimizeFID();
      optimizeBundle();
    });

    // Performance monitoring for debugging
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime;
            if (lcp > 2500) {
              console.warn(`LCP: ${lcp.toFixed(0)}ms - Target: <2500ms`);
            } else {
              console.log(`✅ LCP: ${lcp.toFixed(0)}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Cleanup
      return () => observer.disconnect();
    }
  }, []);

  return <>{children}</>;
};

export default LighthousePerformanceOptimizer;