import { useEffect, useState, Suspense, lazy } from 'react';
import NativeECO4Form from '@/components/NativeECO4Form';
import OptimizedImage from '@/components/OptimizedImage';
import HeroSkeleton from '@/components/HeroSkeleton';
import LazySection from '@/components/LazySection';
import { CheckCircle, Home, Thermometer, Heart, Shield } from 'lucide-react';
// Performance hooks removed

// Lazy load sections that are below the fold
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));

const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Performance hooks removed

  useEffect(() => {
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    // Mark hero as loaded immediately for faster perceived performance
    setHeroLoaded(true);

    // Use requestAnimationFrame for smoother scrolling
    let ticking = false;
    const updateScrollY = () => {
      setScrollY(window.scrollY);
      ticking = false;
    };

    const handleSmoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleSmoothScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleSmoothScroll);
  }, []);

  const benefits = [
    "Heating Upgrades",
    "Solar Panels", 
    "Insulation",
    "Free Government Backed Scheme"
  ];

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

  if (!heroLoaded) {
    return <HeroSkeleton />;
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-30 will-change-transform">
          <OptimizedImage
            src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
            alt="ECO4 Energy Efficiency Background - Aerial view of modern Scottish houses with solar panels"
            className="w-full h-full object-cover mix-blend-multiply"
            priority={true}
            responsive={true}
            preload={true}
            width={1920}
            height={1080}
            sizes="100vw"
            modernFormats={false}
            fetchPriority="high"
            style={{ 
              transform: `translate3d(0, ${scrollY * 0.3}px, 0)`
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                ECO4 Scheme
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Free energy efficiency upgrades for your home
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                The Westminster backed ECO4 scheme provides free heating upgrades, solar panels, and insulation to eligible households across Scotland.
              </p>
              
              <div className="mb-8">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                      <span className="text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <NativeECO4Form />
            </div>
          </div>
        </div>
      </section>
      
        <LazySection fallback={
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
        <Suspense fallback={<div>Loading eligibility section...</div>}>
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
      </LazySection>
      
      <LazySection fallback={
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
        <Suspense fallback={<div>Loading process section...</div>}>
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
      </LazySection>
    </div>
  );
};

export default ECO4;
