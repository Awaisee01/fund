// Bundle analyzer for performance monitoring
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { LCPOptimizer } from "./components/LCPOptimizer";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { PerformanceImageOptimizer } from "./components/PerformanceImageOptimizer";
import "./lib/console-override";
import "./index.css";

// Lazy load non-critical components for better bundle splitting
const App = lazy(() => import("./App"));

// Critical performance initialization
const initPerformanceOptimizations = () => {
  // Mark performance timing
  if ('performance' in window && 'mark' in performance) {
    performance.mark('app-init-start');
  }

  // Preload hero images for LCP optimization
  const heroImages = [
    "/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png",
    "/lovable-uploads/aceccd77-e1e4-46e3-9541-75492bfd3619.png"
  ];
  
  heroImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });

  // Optimize viewport for mobile performance
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
    );
  }

  // Add performance observer for Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Monitor LCP specifically
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('🎯 LCP:', entry.startTime.toFixed(2) + 'ms');
            
            // Mark LCP completion
            if ('performance' in window && 'mark' in performance) {
              performance.mark('lcp-measured');
            }
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Silently handle observer errors
    }
  }
};

// Initialize immediately
initPerformanceOptimizations();

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// High-performance loading fallback
const PerformanceFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Render with performance monitoring
root.render(
  <StrictMode>
    <LCPOptimizer>
      <PerformanceMonitor />
      <PerformanceImageOptimizer />
      <Suspense fallback={<PerformanceFallback />}>
        <App />
      </Suspense>
    </LCPOptimizer>
  </StrictMode>
);

// Defer non-critical resources using idle callback
const deferNonCriticalResources = () => {
  // Facebook Pixel (non-critical)
  import('./lib/facebook-pixel')
    .then(({ initializeFacebookPixel }) => {
      initializeFacebookPixel();
    })
    .catch(() => {
      // Silent fail for analytics
    });
  
  // Prefetch likely routes (non-critical)
  const routes = ['/eco4', '/solar', '/gas-boilers', '/home-improvements', '/contact'];
  routes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.fetchPriority = 'low';
    document.head.appendChild(link);
  });
  
  // Register service worker for caching (non-critical)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(() => {
        // Silent fail for service worker
      });
  }
  
  // Performance mark
  if ('performance' in window && 'mark' in performance) {
    performance.mark('non-critical-resources-loaded');
    performance.measure('app-init-complete', 'app-init-start', 'non-critical-resources-loaded');
  }
};

// Use idle callback for better performance
if ('requestIdleCallback' in window) {
  requestIdleCallback(deferNonCriticalResources, { timeout: 5000 });
} else {
  // Fallback with increased delay
  setTimeout(deferNonCriticalResources, 4000);
}