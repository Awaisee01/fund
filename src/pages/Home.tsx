
import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
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
      <HeroSection />
      <ServicesGrid />
      <TrustBadges />
      <CallToActionSection />
    </div>
  );
};

export default Home;
