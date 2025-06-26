
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
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
      <Navigation />
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
      <ServicesGrid />
      <TrustBadges />
      <CallToActionSection />
    </div>
  );
};

export default Home;
