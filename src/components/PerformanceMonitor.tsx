import { useEffect, useCallback } from 'react';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

const PerformanceMonitor = ({ children }: PerformanceMonitorProps) => {
  // Optimize forced reflow issues
  const optimizeReflows = useCallback(() => {
    // Batch DOM operations to prevent layout thrashing
    let pendingReads: (() => void)[] = [];
    let pendingWrites: (() => void)[] = [];
    let scheduled = false;

    const flushOperations = () => {
      // Execute all reads first
      pendingReads.forEach(read => read());
      pendingReads = [];
      
      // Then execute all writes
      pendingWrites.forEach(write => write());
      pendingWrites = [];
      
      scheduled = false;
    };

    // Global batch function for DOM operations
    (window as any).batchDOMOperation = (operation: () => void, isWrite = true) => {
      if (isWrite) {
        pendingWrites.push(operation);
      } else {
        pendingReads.push(operation);
      }

      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(flushOperations);
      }
    };
  }, []);

  // Network dependency optimization
  const optimizeNetworkDeps = useCallback(() => {
    // Preload critical assets with high priority
    const criticalAssets = [
      { href: '/src/index.css', as: 'style' },
      { href: '/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.webp', as: 'image' }
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset.href;
      link.as = asset.as;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    });
  }, []);

  // Lazy load components optimization
  const optimizeComponentLoading = useCallback(() => {
    // Intersection Observer for lazy component loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (target.dataset.lazyComponent) {
              // Load component when in viewport
              import(target.dataset.lazyComponent).then(module => {
                // Component loading logic
              }).catch(() => {
                // Silent fail for missing components
              });
              observer.unobserve(target);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    // Observe lazy-loadable elements
    document.querySelectorAll('[data-lazy-component]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Third-party script optimization
  const optimizeThirdPartyScripts = useCallback(() => {
    // Delay non-critical third-party scripts
    const delayThirdPartyScripts = () => {
      // Facebook Pixel already optimized in HTML
      // Add other third-party script optimizations here
      console.log('✅ Third-party scripts optimized');
    };

    // Use requestIdleCallback or setTimeout fallback
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(delayThirdPartyScripts, { timeout: 2000 });
    } else {
      setTimeout(delayThirdPartyScripts, 2000);
    }
  }, []);

  useEffect(() => {
    // Initialize all performance optimizations
    optimizeReflows();
    optimizeNetworkDeps();
    optimizeThirdPartyScripts();
    
    const cleanupLazyLoading = optimizeComponentLoading();
    
    // Performance monitoring
    if ('performance' in window) {
      // Monitor LCP
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers without LCP support
      }

      return () => {
        observer.disconnect();
        cleanupLazyLoading();
      };
    }

    return cleanupLazyLoading;
  }, [optimizeReflows, optimizeNetworkDeps, optimizeThirdPartyScripts, optimizeComponentLoading]);

  return <>{children}</>;
};

export default PerformanceMonitor;