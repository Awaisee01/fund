import { useEffect, lazy, Suspense, useState, useRef } from 'react';
import HomeImprovementsHero from '@/components/home-improvements/HomeImprovementsHero';

// Lazy load non-critical components to reduce initial bundle size
const ProcessSteps = lazy(() => import('@/components/home-improvements/ProcessSteps'));
const BeforeAfterCarousel = lazy(() => import('@/components/home-improvements/BeforeAfterCarousel'));

// Simple loading skeleton component
const LoadingSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} bg-gray-100 animate-pulse rounded-lg mx-auto max-w-7xl`}>
    <div className="p-8">
      <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

// Custom hook for intersection observer (loads content when scrolled into view)
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// Lazy section component that only renders when scrolled into view
const LazySection = ({ children, fallback }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

const HomeImprovements = () => {
  useEffect(() => {
    document.title = "Free Home Improvements Scotland - Government Grants & Upgrades | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access free home improvements in Scotland through government grants. Upgrade your property with insulation, windows, doors, and energy efficiency improvements.');
    }
  }, []);

  return (
    <div>
      {/* Critical above-the-fold content - loads immediately */}
      <HomeImprovementsHero />
      
      {/* Lazy load ProcessSteps when scrolled into view */}
      <LazySection fallback={<LoadingSkeleton height="h-96" />}>
        <Suspense fallback={<LoadingSkeleton height="h-96" />}>
          <ProcessSteps />
        </Suspense>
      </LazySection>

      {/* Lazy load BeforeAfterCarousel when scrolled into view */}
      <LazySection fallback={<LoadingSkeleton height="h-80" />}>
        <Suspense fallback={<LoadingSkeleton height="h-80" />}>
          <BeforeAfterCarousel />
        </Suspense>
      </LazySection>

      {/* Wall Renovation Colours Section - lazy loaded */}
      <LazySection 
        fallback={
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <LoadingSkeleton height="h-96" />
            </div>
          </section>
        }
      >
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Wall Renovation Colours
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our range of premium wall coating colours to transform your property's exterior
              </p>
            </div>
            
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/36cc3bdf-84b2-410c-9c9f-11faa27ac900.png"
                alt="Wall Renovation Colour Options - Light Grey, Water Lily, White, Devon Stone, Polar White, Cotswold Cream, Beige, Cotswold Stone, Pebble, Sage Green"
                className="max-w-full h-auto rounded-lg shadow-lg"
                width={1200}
                height={600}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        </section>
      </LazySection>

      {/* Roof Renovation Colours Section - lazy loaded */}
      <LazySection
        fallback={
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <LoadingSkeleton height="h-64" />
            </div>
          </section>
        }
      >
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Roof Renovation Colours
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select from our premium roof coating colours to enhance your property's appearance
              </p>
            </div>
            
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/20eec8da-2186-4c0c-9104-fca70d33ca81.png"
                alt="Roof Renovation Colour Options - Tile Red, Anthracite, Black Blue, Rustic, Red Brown, Green, Dark Brown"
                className="max-w-full h-auto rounded-lg shadow-lg"
                width={1200}
                height={220}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  );
};

export default HomeImprovements;