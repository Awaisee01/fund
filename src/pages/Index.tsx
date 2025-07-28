
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
        benefits={[
          "Free Solar Panels",
          "Free Heating Upgrades", 
          "Free Insulation",
          "Free Gas Boilers",
          "Grants for Home Improvements"
        ]}
      />
      
      {/* Scottish Homes Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforming Scottish Homes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've helped thousands of Scottish homeowners improve their energy efficiency and reduce costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/AerialTownDesktop.webp"
                alt="Scottish residential area with energy efficient homes receiving government funding"
                width="400"
                height="250"
                className="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Energy Efficient Communities</h3>
                <p className="text-gray-600">Whole neighborhoods benefiting from ECO4 improvements and solar installations.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
                alt="Modern Scottish home with solar panels and energy upgrades"
                width="400"
                height="250"
                className="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Solar Panel Installations</h3>
                <p className="text-gray-600">Free solar panels reducing energy bills for Scottish families.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="/lovable-uploads/245736bc-2f67-4f44-938d-82fa05111548.png"
                alt="Scottish home with wall and roof improvements through government grants"
                width="400"
                height="250"
                className="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Home Improvements</h3>
                <p className="text-gray-600">Wall and roof upgrades improving insulation and appearance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ServicesGrid />
      <TrustBadges />
      <CallToActionSection />
    </div>
  );
};

export default Index;
