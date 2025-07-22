import { useEffect } from 'react';

// Performance monitoring and optimization utilities
export const performanceOptimizer = {
  // Monitor Core Web Vitals
  observeWebVitals: () => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Optimize image loading with intersection observer
  optimizeImages: () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Load high-res version
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });

    return imageObserver;
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    if (typeof window === 'undefined') return;

    // Preload likely navigation targets
    const criticalRoutes = ['/eco4', '/gas-boilers', '/home-improvements', '/solar'];
    
    criticalRoutes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  },

  // Optimize font loading
  optimizeFonts: () => {
    if (typeof window === 'undefined') return;

    // Use font-display: swap for better perceived performance
    if ('fonts' in document) {
      const fontFace = new FontFace(
        'Inter',
        'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)',
        { display: 'swap' }
      );
      
      fontFace.load().then(() => {
        document.fonts.add(fontFace);
      });
    }
  },

  // Monitor network conditions
  adaptToNetworkConditions: () => {
    if (typeof window === 'undefined' || !('connection' in navigator)) return;

    const connection = (navigator as any).connection;
    
    if (connection) {
      const handleConnectionChange = () => {
        const { effectiveType, downlink } = connection;
        
        // Adapt quality based on connection
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
          // Reduce image quality, disable animations
          document.body.classList.add('low-bandwidth');
        } else {
          document.body.classList.remove('low-bandwidth');
        }
      };

      connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange(); // Initial check
    }
  },

  // Memory optimization
  optimizeMemory: () => {
    if (typeof window === 'undefined') return;

    // Clean up unused resources on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause non-critical operations
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => video.pause());
        
        // Clear unnecessary caches
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              if (cacheName.includes('temp-')) {
                caches.delete(cacheName);
              }
            });
          });
        }
      }
    });
  }
};

// Hook for easy integration
export const usePerformanceOptimizations = () => {
  useEffect(() => {
    // Initialize all optimizations
    performanceOptimizer.observeWebVitals();
    performanceOptimizer.optimizeImages();
    performanceOptimizer.preloadCriticalResources();
    performanceOptimizer.optimizeFonts();
    performanceOptimizer.adaptToNetworkConditions();
    performanceOptimizer.optimizeMemory();
  }, []);
};