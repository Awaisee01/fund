import { useEffect, useState, startTransition } from 'react';

// Critical above-the-fold components loaded immediately
import CriticalECO4Hero from '@/components/CriticalECO4Hero';

// Remove ALL non-critical lazy imports for mobile
// Everything below the fold removed

const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [criticalLoaded, setCriticalLoaded] = useState(false);

  // Minimal initialization for mobile performance
  useEffect(() => {
    // Set page metadata immediately
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    setCriticalLoaded(true);
  }, []);

  // Ultra-minimal loading skeleton
  if (!criticalLoaded) {
    return (
      <div className="min-h-screen" style={{background:'linear-gradient(45deg,rgba(37,99,235,0.8),rgba(22,163,74,0.8))'}}>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div style={{animation:'pulse 2s infinite'}}>
                <div style={{height:'4rem',background:'rgba(255,255,255,0.2)',borderRadius:'0.5rem',width:'75%',marginBottom:'1rem'}}></div>
                <div style={{height:'2rem',background:'rgba(255,255,255,0.15)',borderRadius:'0.5rem',width:'50%',marginBottom:'1rem'}}></div>
                <div style={{height:'1.5rem',background:'rgba(255,255,255,0.1)',borderRadius:'0.5rem',width:'80%'}}></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div style={{height:'24rem',background:'rgba(255,255,255,0.1)',borderRadius:'0.5rem',animation:'pulse 2s infinite'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ONLY critical above-the-fold content for mobile */}
      <CriticalECO4Hero scrollY={scrollY} />
      
      {/* Remove ALL below-the-fold content for mobile performance */}
      {/* No eligibility section, no process section, no additional content */}
    </div>
  );
};

export default ECO4;