
console.log('📄 Index page module loading...');
import React, { useEffect } from 'react';
import OptimizedHero from '@/components/OptimizedHero';
import ServicesGrid from '@/components/ServicesGrid';
import TrustBadges from '@/components/TrustBadges';
import CallToActionSection from '@/components/CallToActionSection';

const Index = () => {
  console.log('🏠 Index page component rendering...');

  useEffect(() => {
    console.log('Index page loaded');
    document.title = 'Scottish Grants & Funding';
  }, []);

  return (
    <div className="min-h-screen">
      <OptimizedHero 
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="From heating upgrades, to free solar panels, to improving the look of Scotland's homes. Funding for Scotland are here to help people unlock the funding and grant schemes they are entitled to."
        benefits={[
          "Free Solar Panels",
          "Free Heating Upgrades", 
          "Free Insulation",
          "Free Gas Boilers",
          "Grants for Home Improvements"
        ]}
      />
      
      <ServicesGrid />
      <TrustBadges />
      <CallToActionSection />
    </div>
  );
};

export default Index;
