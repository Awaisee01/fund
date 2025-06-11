
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import TrustBadges from '@/components/TrustBadges';
import CallToActionSection from '@/components/CallToActionSection';

const Home = () => {
  useEffect(() => {
    document.title = "Funding For Scotland - Scottish Home Improvement Grants & Funding";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Scotland\'s leading consultancy for homeowner grants and funding. Access ECO4 grants, solar panels, boiler replacements, and home improvement funding up to £25,000.');
    }
  }, []);

  return (
    <div>
      <Hero 
        title="Funding For Scotland"
        subtitle="Get Up To £25,000 In Free Grants"
        description="Scotland's leading consultancy for homeowner grants and funding. We help Scottish homeowners access government grants for energy efficiency improvements, solar panels, boiler replacements, and home improvements."
        benefits={[
          "100% Free Service - No Hidden Costs",
          "Expert Grant Application Support",
          "Access to Multiple Funding Streams",
          "Professional Installation Network"
        ]}
      />
      <ServicesGrid />
      <TrustBadges />
      <CallToActionSection />
    </div>
  );
};

export default Home;
