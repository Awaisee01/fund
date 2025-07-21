
import { useEffect, useState, Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { usePagePerformance, useViewportOptimization } from '@/hooks/usePerformanceOptimization';
import { LazyLoader, preloadComponent } from '@/components/LazyLoader';

// Lazy load below-the-fold content with priority
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

// Preload critical below-the-fold components after hero loads
const preloadBelowFoldComponents = () => {
  setTimeout(() => {
    preloadComponent(() => import('@/components/ServicesGrid'));
    preloadComponent(() => import('@/components/TrustBadges'));
  }, 1000); // Start preloading after 1 second
};

// Loading fallback components
const SectionSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-64 rounded-lg mx-auto max-w-7xl mb-8"></div>
);

const TrustBadgesSkeleton = () => (
  <div className="animate-pulse bg-gray-100 h-20 w-full"></div>
);

const Home = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Performance optimizations
  usePagePerformance('home');
  useViewportOptimization();

  useEffect(() => {
    document.title = "Funding For Scotland - Scottish Home Improvement Grants & Funding";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Scotland\'s leading consultancy for homeowner grants and funding. Access ECO4 grants, solar panels, boiler replacements, and home improvement funding up to £25,000.');
    }

    // Mark hero as loaded and start preloading below-fold content
    setHeroLoaded(true);
    preloadBelowFoldComponents();
  }, []);

  if (!heroLoaded) {
    return <PageHeroSkeleton hasForm={true} />;
  }

  return (
    <div>
      <Hero 
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="We help people in Scotland access local authority schemes, government backed schemes, and other grants around Scotland. Chat with our advisors today and find out what you're entitled to."
        benefits={[
          "Free eligibility assessment",
          "Nothing to pay, we're a free advice group",
          "Guidance through the whole process",
          "Friendly team ready to chat"
        ]}
      />
      <Suspense fallback={
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <ServicesGrid />
      </Suspense>
      <Suspense fallback={
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <TrustBadges />
      </Suspense>
      <Suspense fallback={
        <div className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-blue-300 rounded w-1/2 mx-auto"></div>
              <div className="h-6 bg-blue-300 rounded w-3/4 mx-auto"></div>
              <div className="h-12 bg-blue-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      }>
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Home;
