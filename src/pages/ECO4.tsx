import { useEffect, useState } from 'react';

// Minimal ECO4 page for maximum mobile performance
const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Set page metadata
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    // Minimal scroll tracking
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden" style={{background:'linear-gradient(45deg,rgba(37,99,235,0.8),rgba(22,163,74,0.8))'}}>
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
            alt="Scottish homes aerial view"
            className="w-full h-full object-cover"
            style={{transform:`translateY(${scrollY * 0.5}px)`}}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="lg:order-1 text-white">
              <h1 className="text-3xl lg:text-6xl font-bold mb-6">
                Free ECO4 Grants in Scotland
              </h1>
              <p className="text-lg mb-8">
                Get 100% government funding for energy efficiency improvements. Free insulation, 
                boiler upgrades, and home improvements with no upfront costs.
              </p>
              <div style={{background:'rgba(255,255,255,0.1)',borderRadius:'0.5rem',padding:'2rem',backdropFilter:'blur(4px)'}}>
                <h3 className="text-xl font-bold mb-4">Check Your Eligibility</h3>
                <form style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  <input type="text" placeholder="Full Name" style={{padding:'0.75rem',borderRadius:'0.25rem',border:'none'}} />
                  <input type="email" placeholder="Email Address" style={{padding:'0.75rem',borderRadius:'0.25rem',border:'none'}} />
                  <input type="tel" placeholder="Phone Number" style={{padding:'0.75rem',borderRadius:'0.25rem',border:'none'}} />
                  <select style={{padding:'0.75rem',borderRadius:'0.25rem',border:'none'}}>
                    <option>What are you interested in?</option>
                    <option>ECO4 Insulation</option>
                    <option>Boiler Replacement</option>
                    <option>Solar Panels</option>
                    <option>Home Improvements</option>
                  </select>
                  <button type="submit" style={{background:'#10b981',color:'white',padding:'0.75rem',borderRadius:'0.25rem',border:'none',fontWeight:'600'}}>
                    Get Free Assessment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section style={{padding:'5rem 0',background:'#f9fafb'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center" style={{marginBottom:'4rem'}}>
            <h2 style={{fontSize:'2.25rem',fontWeight:'700',color:'#1f2937',marginBottom:'1rem'}}>
              ECO4 Qualifying Criteria
            </h2>
            <p style={{fontSize:'1.125rem',color:'#6b7280'}}>
              Check if you qualify for free energy efficiency improvements
            </p>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'2rem'}}>
            <div className="text-center">
              <div style={{width:'4rem',height:'4rem',margin:'0 auto 1rem',background:'#10b981',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <h3 style={{fontSize:'1.25rem',fontWeight:'600',color:'#1f2937',marginBottom:'0.5rem'}}>
                Property Type
              </h3>
              <p style={{color:'#6b7280'}}>
                Open to homeowners, private tenants, and landlords
              </p>
            </div>
            
            <div className="text-center">
              <div style={{width:'4rem',height:'4rem',margin:'0 auto 1rem',background:'#10b981',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 style={{fontSize:'1.25rem',fontWeight:'600',color:'#1f2937',marginBottom:'0.5rem'}}>
                Energy Rating
              </h3>
              <p style={{color:'#6b7280'}}>
                Property has EPC rating of D, E, F, or G
              </p>
            </div>
            
            <div className="text-center">
              <div style={{width:'4rem',height:'4rem',margin:'0 auto 1rem',background:'#10b981',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 style={{fontSize:'1.25rem',fontWeight:'600',color:'#1f2937',marginBottom:'0.5rem'}}>
                Health Conditions
              </h3>
              <p style={{color:'#6b7280'}}>
                Including respiratory conditions, cardiovascular conditions and many more
              </p>
            </div>
            
            <div className="text-center">
              <div style={{width:'4rem',height:'4rem',margin:'0 auto 1rem',background:'#10b981',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M12 1l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/>
                </svg>
              </div>
              <h3 style={{fontSize:'1.25rem',fontWeight:'600',color:'#1f2937',marginBottom:'0.5rem'}}>
                Qualifiers
              </h3>
              <p style={{color:'#6b7280'}}>
                You only need to tick one box - applies to anyone living at the property
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section style={{padding:'5rem 0',background:'#ffffff'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center" style={{marginBottom:'4rem'}}>
            <h2 style={{fontSize:'2.25rem',fontWeight:'700',color:'#1f2937',marginBottom:'1rem'}}>
              Simple 4-Step Process
            </h2>
            <p style={{fontSize:'1.125rem',color:'#6b7280'}}>
              Get your free ECO4 improvements in just 4 easy steps
            </p>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'2rem'}}>
            {[
              {step: "1", title: "Apply Online", desc: "Complete our simple online form"},
              {step: "2", title: "Free Assessment", desc: "We'll assess your property for free"},
              {step: "3", title: "Installation", desc: "Professional installation at no cost"},
              {step: "4", title: "Enjoy Savings", desc: "Start saving on your energy bills"}
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div style={{width:'3rem',height:'3rem',margin:'0 auto 1rem',background:'#2563eb',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:'700'}}>
                  {item.step}
                </div>
                <h3 style={{fontSize:'1.25rem',fontWeight:'600',color:'#1f2937',marginBottom:'0.5rem'}}>
                  {item.title}
                </h3>
                <p style={{color:'#6b7280'}}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ECO4;