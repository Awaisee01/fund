
import { useEffect, useState, Suspense, lazy } from 'react';
import HomeImprovementsHero from '@/components/home-improvements/HomeImprovementsHero';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import OptimizedImage from '@/components/OptimizedImage';
import { usePagePerformance, useViewportOptimization } from '@/hooks/usePerformanceOptimization';

// Lazy load non-critical components
const ProcessSteps = lazy(() => import('@/components/home-improvements/ProcessSteps'));
const BeforeAfterCarousel = lazy(() => import('@/components/home-improvements/BeforeAfterCarousel'));

const HomeImprovements = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Performance optimizations
  usePagePerformance('home-improvements');
  useViewportOptimization();

  useEffect(() => {
    document.title = "Free Home Improvements Scotland - Government Grants & Upgrades | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access free home improvements in Scotland through government grants. Upgrade your property with insulation, windows, doors, and energy efficiency improvements.');
    }

    setHeroLoaded(true);
  }, []);

  if (!heroLoaded) {
    return <PageHeroSkeleton hasForm={true} />;
  }

  return (
    <div>
      <HomeImprovementsHero />
      
      <Suspense fallback={
        <div className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <ProcessSteps />
      </Suspense>
      
      <Suspense fallback={
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <BeforeAfterCarousel />
      </Suspense>

      {/* Wall Renovation Colours Section */}
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
            <OptimizedImage
              src="/lovable-uploads/36cc3bdf-84b2-410c-9c9f-11faa27ac900.png"
              alt="Wall Renovation Colour Options - Light Grey, Water Lily, White, Devon Stone, Polar White, Cotswold Cream, Beige, Cotswold Stone, Pebble, Sage Green"
              className="max-w-full h-auto"
              width={1200}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Roof Renovation Colours Section */}
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
            <OptimizedImage
              src="/lovable-uploads/20eec8da-2186-4c0c-9104-fca70d33ca81.png"
              alt="Roof Renovation Colour Options - Tile Red, Anthracite, Black Blue, Rustic, Red Brown, Green, Dark Brown"
              className="max-w-full h-auto"
              width={1200}
              height={220}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeImprovements;
