import { useEffect, useState } from 'react';

interface OptimizedHeroLoaderProps {
  children: React.ReactNode;
}

/**
 * Optimized Hero Loader - Ensures hero section loads as fast as possible for LCP
 */
export const OptimizedHeroLoader = ({ children }: OptimizedHeroLoaderProps) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Critical path optimization for hero section
    const optimizeHeroLoading = () => {
      // 1. Preload only critical above-the-fold images
      const currentPath = window.location.pathname;
      let criticalImage = '';
      
      // Only preload images that will actually be displayed
      if (currentPath === '/eco4') {
        criticalImage = '/lovable-uploads/AerialTownDesktop.webp';
      } else if (currentPath === '/solar') {
        criticalImage = '/src/assets/solar-hero-houses.webp';
      }
      
      if (criticalImage) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = criticalImage;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      }
      
      // 2. Mark hero content as critical for rendering
      const heroSections = document.querySelectorAll('section, .hero-section, [data-hero]');
      heroSections.forEach((section: Element) => {
        const element = section as HTMLElement;
        element.style.contentVisibility = 'visible';
        element.style.contain = '';
      });
      
      setIsOptimized(true);
    };
    
    // Run immediately for fastest LCP
    optimizeHeroLoading();
    
    // Fallback for dynamic content
    const timer = setTimeout(optimizeHeroLoading, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};

export default OptimizedHeroLoader;