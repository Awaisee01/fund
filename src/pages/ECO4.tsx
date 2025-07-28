import { useEffect, useState, Suspense, lazy, startTransition } from 'react';
import { Home, Thermometer, Heart, Shield } from 'lucide-react';

// Critical above-the-fold components loaded immediately
import PerformanceOptimizedECO4 from '@/components/PerformanceOptimizedECO4';

// Non-critical components lazy loaded after above-the-fold renders
const EligibilitySection = lazy(() => 
  import('@/components/EligibilitySection').then(module => ({ 
    default: module.default 
  }))
);

const ProcessSection = lazy(() => 
  import('@/components/ProcessSection').then(module => ({ 
    default: module.default 
  }))
);

// Defer resource prefetcher until after critical rendering
const ResourcePrefetcher = lazy(() => 
  import('@/components/ResourcePrefetcher').then(module => ({ 
    default: module.default 
  }))
);

const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [nonCriticalReady, setNonCriticalReady] = useState(false);
  const [userBehavior, setUserBehavior] = useState({
    scrollDepth: 0,
    timeOnPage: 0,
    interactions: 0
  });

  // Critical initialization - runs immediately
  useEffect(() => {
    // Set page metadata immediately
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    // Mark critical content as loaded
    setCriticalLoaded(true);

    // Defer non-critical initialization
    startTransition(() => {
      setTimeout(() => {
        setNonCriticalReady(true);
      }, 100);
    });
  }, []);

  // Non-critical behavior tracking - deferred
  useEffect(() => {
    if (!nonCriticalReady) return;

    const startTime = Date.now();
    let maxScrollDepth = 0;
    let interactionCount = 0;
    let ticking = false;

    const updateScrollY = () => {
      const currentScroll = window.scrollY;
      const scrollPercent = Math.round((currentScroll / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      setScrollY(currentScroll);
      setUserBehavior(prev => ({ ...prev, scrollDepth: maxScrollDepth }));
      ticking = false;
    };

    const handleSmoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    const trackInteraction = () => {
      interactionCount++;
      setUserBehavior(prev => ({ ...prev, interactions: interactionCount }));
    };

    // Track time on page every 5 seconds
    const timeTracker = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      setUserBehavior(prev => ({ ...prev, timeOnPage }));
    }, 5000);

    // Add event listeners with passive flags for performance
    window.addEventListener('scroll', handleSmoothScroll, { passive: true });
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, trackInteraction, { passive: true });
    });

    return () => {
      window.removeEventListener('scroll', handleSmoothScroll);
      ['click', 'touchstart', 'keydown'].forEach(event => {
        document.removeEventListener(event, trackInteraction);
      });
      clearInterval(timeTracker);
    };
  }, [nonCriticalReady]);

  const eligibilityRequirements = [
    {
      icon: Home,
      title: "Property Type",
      description: "Open to homeowners, private tenants, and landlords"
    },
    {
      icon: Thermometer,
      title: "Energy Rating", 
      description: "Property has EPC rating of D, E, F, or G"
    },
    {
      icon: Heart,
      title: "Health Conditions",
      description: "Including respiratory conditions, cardiovascular conditions and many more. See full list below"
    },
    {
      icon: Shield,
      title: "Qualifiers",
      description: "Please review the list of qualifiers below. You only need to tick one box and these apply to anyone living at the property."
    }
  ];

  // Critical loading skeleton with immediate render
  if (!criticalLoaded) {
    return (
      <div className="min-h-screen hero-gradient text-white">
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-white/20 rounded w-3/4"></div>
                <div className="h-8 bg-white/15 rounded w-1/2"></div>
                <div className="h-6 bg-white/10 rounded w-4/5"></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-96 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Critical above-the-fold content - loads immediately */}
      <PerformanceOptimizedECO4 scrollY={scrollY} />
      
      {/* Non-critical resource prefetcher - deferred */}
      {nonCriticalReady && (
        <Suspense fallback={null}>
          <ResourcePrefetcher currentPage="eco4" userBehavior={userBehavior} />
        </Suspense>
      )}
      
      {/* Below-the-fold content - lazy loaded */}
      {nonCriticalReady && (
        <>
          <Suspense fallback={
            <div className="py-20 bg-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-48 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }>
            <section className="py-20 bg-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    ECO4 Qualifying Criteria
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    If you are unsure if you qualify, please feel free to complete the enquiry form at the top of the page and chat to one of our advisors
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {eligibilityRequirements.map((requirement, index) => {
                    const Icon = requirement.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {requirement.title}
                        </h3>
                        <p className="text-gray-600">
                          {requirement.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <EligibilitySection />
              </div>
            </section>
          </Suspense>
          
          <Suspense fallback={
            <div className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }>
            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    ECO4 Installation Process
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our streamlined process makes getting ECO4 improvements as easy as possible. From initial assessment 
                    to final installation, we handle everything for you.
                  </p>
                </div>
                
                <ProcessSection />
              </div>
            </section>
          </Suspense>
        </>
      )}
    </div>
  );
};

export default ECO4;