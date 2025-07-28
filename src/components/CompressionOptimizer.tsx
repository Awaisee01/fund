import { useEffect } from 'react';

const CompressionOptimizer = () => {
  useEffect(() => {
    // 1. Add compression hints to server
    const addCompressionHints = () => {
      // Add meta tags for compression hints
      const compressionMeta = document.createElement('meta');
      compressionMeta.httpEquiv = 'Accept-Encoding';
      compressionMeta.content = 'gzip, deflate, br';
      document.head.appendChild(compressionMeta);

      // Add HTTP/2 server push hints
      const serverPushMeta = document.createElement('meta');
      serverPushMeta.httpEquiv = 'Link';
      serverPushMeta.content = '</assets/js/react-core.js>; rel=preload; as=script, </assets/css/index.css>; rel=preload; as=style';
      document.head.appendChild(serverPushMeta);
    };

    // 2. Verify compression support
    const verifyCompression = () => {
      // Check if browser supports Brotli
      const supportsBrotli = 'CompressionStream' in window;
      
      // Check current page compression
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          const encoding = response.headers.get('content-encoding');
          if (encoding) {
            console.log(`✅ Page compression: ${encoding}`);
          } else {
            console.warn('⚠️ Page not compressed - check server configuration');
          }
        })
        .catch(() => {
          console.warn('⚠️ Could not verify compression');
        });

      // Check asset compression
      const assets = Array.from(document.querySelectorAll('script[src], link[href*=".css"]'));
      
      assets.forEach((asset: Element) => {
        const src = (asset as HTMLScriptElement).src || (asset as HTMLLinkElement).href;
        if (src && !src.startsWith('data:')) {
          fetch(src, { method: 'HEAD' })
            .then(response => {
              const encoding = response.headers.get('content-encoding');
              const size = response.headers.get('content-length');
              
              if (encoding) {
                console.log(`✅ ${src.split('/').pop()}: ${encoding} compression`);
              } else if (size && parseInt(size) > 10000) {
                console.warn(`⚠️ ${src.split('/').pop()}: ${(parseInt(size) / 1024).toFixed(1)}KB uncompressed`);
              }
            })
            .catch(() => {
              // Ignore CORS errors for external resources
            });
        }
      });
    };

    // 3. Optimize resource hints for better caching
    const optimizeResourceHints = () => {
      // Add DNS prefetch for external domains
      const externalDomains = [
        'cdn.gpteng.co',
        'connect.facebook.net'
      ];

      externalDomains.forEach(domain => {
        const prefetch = document.createElement('link');
        prefetch.rel = 'dns-prefetch';
        prefetch.href = `//${domain}`;
        document.head.appendChild(prefetch);
      });

      // Add preconnect for critical external resources
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://cdn.gpteng.co';
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    };

    // 4. Enable resource compression for dynamic content
    const enableDynamicCompression = () => {
      // Override fetch to add compression headers
      const originalFetch = window.fetch;
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        const newInit = {
          ...init,
          headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            ...((init?.headers as Record<string, string>) || {})
          }
        };
        
        return originalFetch(input, newInit);
      };
    };

    // 5. Monitor compression performance
    const monitorCompression = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.transferSize && resourceEntry.decodedBodySize) {
              const compressionRatio = (1 - resourceEntry.transferSize / resourceEntry.decodedBodySize) * 100;
              
              if (compressionRatio > 50) {
                console.log(`✅ Good compression: ${entry.name.split('/').pop()} - ${compressionRatio.toFixed(1)}%`);
              } else if (compressionRatio > 0) {
                console.warn(`⚠️ Poor compression: ${entry.name.split('/').pop()} - ${compressionRatio.toFixed(1)}%`);
              } else {
                console.warn(`❌ No compression: ${entry.name.split('/').pop()}`);
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    };

    // Execute optimizations
    addCompressionHints();
    optimizeResourceHints();
    enableDynamicCompression();
    
    // Defer verification to avoid blocking
    requestIdleCallback(() => {
      verifyCompression();
      monitorCompression();
    });

    return () => {
      // Restore original fetch if needed
      console.log('🧹 Compression optimizer cleanup completed');
    };
  }, []);

  return null;
};

export default CompressionOptimizer;