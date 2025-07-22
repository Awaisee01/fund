import React, { Suspense, useState, useEffect, lazy } from 'react';
import Hero from '@/components/Hero';

// Lazy load components
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

const Index = () => {
  const [heroLoaded, setHeroLoaded] = useState(true);

  useEffect(() => {
    document.title = 'Scottish Grants & Funding';
  }, []);

  return (
    <div className="min-h-screen">
      <Hero 
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="From heating upgrades, to free solar panels, to improving the look of Scotland homes. Funding for Scotland are here to help people in Scotland unlock the funding and grant schemes they are entitled to"
        benefits={[
          "Free Solar Panels",
          "Free Heating Upgrades", 
          "Free Insulation",
          "Free Gas Boilers",
          "Grants for Home Improvements"
        ]}
      />
      
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
        <ServicesGrid />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
        <TrustBadges />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse"></div>}>
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Index;