
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import TrustBadges from '@/components/TrustBadges';
import CallToActionSection from '@/components/CallToActionSection';

const Index = () => {

  useEffect(() => {
    console.log('Index page loaded');
    document.title = 'Scottish Grants & Funding';
  }, []);

  return (
    <div className="min-h-screen">
      <Hero 
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="From heating upgrades, to free solar panels, to improving the look of Scotland's homes. Funding for Scotland are here to help people unlock the funding and grant schemes they are entitled to."
        backgroundImage="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
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
