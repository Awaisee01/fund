
import { useEffect, useState, Suspense } from 'react';
import HomeImprovementsHero from '@/components/home-improvements/HomeImprovementsHero';
import ProcessSteps from '@/components/home-improvements/ProcessSteps';
import BeforeAfterCarousel from '@/components/home-improvements/BeforeAfterCarousel';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';

const HomeImprovements = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

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
    </div>
  );
};

export default HomeImprovements;
