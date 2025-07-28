import { useEffect } from 'react';

const AdvancedImageOptimizer = () => {
  useEffect(() => {
    // 1. Preload LCP image with highest priority
    const preloadLCPImage = () => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = '/lovable-uploads/hero-desktop.webp';
      preloadLink.setAttribute('fetchpriority', 'high');
      preloadLink.type = 'image/webp';
      preloadLink.setAttribute('imagesrcset', '/lovable-uploads/hero-desktop.webp 1920w, /lovable-uploads/hero-tablet.webp 1024w, /lovable-uploads/hero-mobile.webp 768w');
      preloadLink.setAttribute('imagesizes', '(min-width: 1200px) 1920px, (min-width: 768px) 1024px, 768px');
      
      // Insert at the very beginning of head for maximum priority
      document.head.insertBefore(preloadLink, document.head.firstChild);
      
      console.log('🚀 LCP image preloaded with high priority');
    };

    // 2. Convert images to modern formats with picture elements
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[src*="lovable-uploads"]:not([data-optimized])');
      
      images.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        const src = imgElement.src;
        
        // Skip if already optimized
        if (imgElement.dataset.optimized) return;
        
        // Create picture element with WebP/AVIF support
        const picture = document.createElement('picture');
        
        // Add AVIF source (most modern)
        const avifSource = document.createElement('source');
        avifSource.srcset = src.replace('.png', '.avif').replace('.jpg', '.avif').replace('.jpeg', '.avif');
        avifSource.type = 'image/avif';
        
        // Add WebP source (fallback)
        const webpSource = document.createElement('source');
        webpSource.srcset = src.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp');
        webpSource.type = 'image/webp';
        
        // Clone original img for fallback
        const fallbackImg = imgElement.cloneNode(true) as HTMLImageElement;
        fallbackImg.dataset.optimized = 'true';
        
        // Optimize loading attributes
        if (imgElement.loading !== 'eager') {
          fallbackImg.loading = 'lazy';
        }
        fallbackImg.decoding = 'async';
        
        // Add responsive attributes if missing
        if (!fallbackImg.getAttribute('sizes')) {
          fallbackImg.sizes = '(min-width: 1200px) 1920px, (min-width: 768px) 1024px, 100vw';
        }
        
        // Build picture element
        picture.appendChild(avifSource);
        picture.appendChild(webpSource);
        picture.appendChild(fallbackImg);
        
        // Replace original image
        imgElement.parentNode?.replaceChild(picture, imgElement);
      });
    };

    // 3. Implement responsive image sizing
    const implementResponsiveImages = () => {
      const largeImages = document.querySelectorAll('img[src*="530a44a7"], img[src*="37194ab7"]');
      
      largeImages.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        
        // Add proper sizing attributes
        imgElement.setAttribute('sizes', '(min-width: 1200px) 800px, (min-width: 768px) 600px, 400px');
        
        // Generate srcset for responsive loading
        const baseSrc = imgElement.src;
        const srcset = [
          `${baseSrc}?w=400 400w`,
          `${baseSrc}?w=600 600w`,
          `${baseSrc}?w=800 800w`,
          `${baseSrc}?w=1200 1200w`
        ].join(', ');
        
        imgElement.srcset = srcset;
        
        // Optimize loading
        if (!imgElement.src.includes('hero')) {
          imgElement.loading = 'lazy';
        }
        imgElement.decoding = 'async';
      });
    };

    // 4. Monitor image loading performance
    const monitorImagePerformance = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.initiatorType === 'img') {
              const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
              if (loadTime > 1000) {
                console.warn(`🐌 Slow image load: ${entry.name} took ${loadTime.toFixed(2)}ms`);
              } else {
                console.log(`✅ Image loaded efficiently: ${entry.name} in ${loadTime.toFixed(2)}ms`);
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      }
    };

    // 5. Optimize background images
    const optimizeBackgroundImages = () => {
      const elements = document.querySelectorAll('[style*="background-image"]');
      
      elements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const style = htmlElement.style.backgroundImage;
        
        if (style && style.includes('lovable-uploads')) {
          // Add will-change for better performance
          htmlElement.style.willChange = 'transform';
          
          // Use contain for better rendering
          htmlElement.style.contain = 'layout style paint';
        }
      });
    };

    // Execute optimizations
    preloadLCPImage();
    
    // Defer other optimizations to avoid blocking
    requestIdleCallback(() => {
      optimizeImages();
      implementResponsiveImages();
      optimizeBackgroundImages();
      monitorImagePerformance();
    });

    // Run image optimization again after dynamic content loads
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'IMG' || element.querySelector('img')) {
              hasNewImages = true;
            }
          }
        });
      });
      
      if (hasNewImages) {
        requestIdleCallback(optimizeImages);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default AdvancedImageOptimizer;