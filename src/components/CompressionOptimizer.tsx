import { useEffect } from 'react';

export function CompressionOptimizer() {
  useEffect(() => {
    // Add compression headers and optimization hints
    const addCompressionHeaders = () => {
      // Add meta tags that signal compression support
      const compressionMeta = document.createElement('meta');
      compressionMeta.httpEquiv = 'Accept-Encoding';
      compressionMeta.content = 'gzip, deflate, br';
      document.head.appendChild(compressionMeta);

      // Signal modern format support
      const formatMeta = document.createElement('meta');
      formatMeta.name = 'supported-formats';
      formatMeta.content = 'webp,avif,brotli';
      document.head.appendChild(formatMeta);
    };

    // Optimize caching for static assets
    const optimizeCaching = () => {
      // Add cache control hints for static assets
      const links = document.querySelectorAll('link[rel="stylesheet"], script[src]');
      
      links.forEach(element => {
        const src = element.getAttribute('href') || element.getAttribute('src');
        
        if (src && (src.includes('.css') || src.includes('.js'))) {
          // Add cache optimization hints
          element.setAttribute('data-cache-policy', 'max-age=31536000,immutable');
        }
      });
    };

    // Enable resource hints for better loading
    const addResourceHints = () => {
      // DNS prefetch for external resources
      const dnsPrefetches = [
        'https://fonts.googleapis.com',
        'https://connect.facebook.net',
        'https://cdn.gpteng.co'
      ];

      dnsPrefetches.forEach(domain => {
        const existing = document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = domain;
          document.head.appendChild(link);
        }
      });

      // Preconnect to critical external resources
      const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnects.forEach(url => {
        const existing = document.querySelector(`link[rel="preconnect"][href="${url}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // Optimize font loading
    const optimizeFontLoading = () => {
      // Preload critical fonts
      const fontPreloads = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
          type: 'text/css'
        }
      ];

      fontPreloads.forEach(({ href, type }) => {
        const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = href;
          link.as = 'style';
          link.type = type;
          document.head.appendChild(link);
        }
      });
    };

    // Run optimizations
    addCompressionHeaders();
    optimizeCaching();
    addResourceHints();
    optimizeFontLoading();

  }, []);

  return null;
}

export default CompressionOptimizer;