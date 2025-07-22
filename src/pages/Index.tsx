import React, { Suspense, useState, useEffect, lazy } from 'react';
import Hero from '@/components/Hero';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { usePagePerformance, useViewportOptimization } from '@/hooks/usePerformanceOptimization';

// Lazy load below-the-fold components for optimal performance
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

// Skeleton components for smooth loading states
const ServicesGridSkeleton = () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />;
const TrustBadgesSkeleton = () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;
const CTASkeleton = () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;

const Index = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Performance optimizations
  usePagePerformance('home');
  useViewportOptimization();

  useEffect(() => {
    // Set page metadata
    document.title = 'ECO4 Scheme & Solar Panel Grants | Free Energy Efficiency Upgrades';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Get free home insulation, solar panels, and energy efficiency upgrades through government ECO4 scheme. Check eligibility and apply today for sustainable energy solutions.'
    );

    // Mark hero as loaded and start preloading below-fold content
    setHeroLoaded(true);
  }, []);

  // Show skeleton while hero loads
  if (!heroLoaded) {
    return <PageHeroSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Above-the-fold hero section */}
      <Hero 
        title="Free Home Energy Upgrades"
        subtitle="Get up to £25,000 in government grants"
        description="Transform your home with free insulation, solar panels, and heating upgrades through government ECO4 scheme. No upfront costs, just savings on your energy bills."
        benefits={[
          "Free home insulation worth up to £10,000",
          "Solar panels and battery storage",
          "New heating systems and boilers",
          "No upfront costs or hidden fees",
          "Reduce energy bills by up to 40%"
        ]}
      />
      
      {/* Below-the-fold content with lazy loading */}
      <Suspense fallback={<ServicesGridSkeleton />}>
        <ServicesGrid />
      </Suspense>

      <Suspense fallback={<TrustBadgesSkeleton />}>
        <TrustBadges />
      </Suspense>

      <Suspense fallback={<CTASkeleton />}>
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Index;