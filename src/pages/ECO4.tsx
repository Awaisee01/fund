
import { useEffect, useState, Suspense, lazy } from 'react';
import NativeECO4Form from '@/components/NativeECO4Form';
import OptimizedImage from '@/components/OptimizedImage';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Thermometer, Zap, Shield, Sun, Heart } from 'lucide-react';

// Lazy load below-the-fold content
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));

const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    document.title = "ECO4 Grants Scotland - Free Heating, Solar & Insulation | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access free ECO4 grants in Scotland for heating upgrades, solar panels, and insulation. Check your eligibility for completely funded home improvements worth thousands.');
    }

    // Mark hero as loaded immediately for faster perceived performance - same as Solar page
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
    "Heating upgrades",
    "Solar panels", 
    "Insulation",
    "Heating controls and thermostats"
  ];

  const eligibilityRequirements = [
    {
      icon: Home,
      title: "Property Type",
      description: "Open to homeowners, private tenants, and landlords"
    },
    {
      icon: Thermometer,
      title: "Heating Type",
      description: "Current heating system LPG, Oil, Electric Boiler, Electric Heaters. *Note - Scheme not available to properties on Mains Gas"
    },
    {
      icon: Heart,
      title: "Health Conditions",
      description: "Including respiratory conditions, cardiovascular conditions and many more. See full list below"
    },
    {
      icon: Shield,
      title: "Benefits",
      description: "Receive state benefits or have household income below £31,000 per year"
    }
  ];

  if (!heroLoaded) {
    return <PageHeroSkeleton hasForm={true} />;
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-30 will-change-transform">
          <OptimizedImage
            src="/lovable-uploads/d938082e-41fe-4dc8-a369-85a57cd05599.png"
            alt="ECO4 Background"
            className="w-full h-full object-cover mix-blend-multiply"
            priority={true}
            width={1920}
            height={1080}
            style={{ 
              transform: `translate3d(0, ${scrollY * 0.3}px, 0)`
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                ECO4 Funding
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Completely free heating upgrades, solar panels, and insulation
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                The primary goal of the ECO4 scheme is to improve energy efficiency in homes, reduce carbon emissions, tackle fuel poverty, and support the UK's commitment to net-zero carbon emissions by 2050.
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
                
                <div className="mt-6">
                  <p className="text-sm text-blue-200 italic">
                    * ECO4 unavailable to properties with Mains Gas heating
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <NativeECO4Form />
            </div>
          </div>
        </div>
      </section>
      
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
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
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Does ECO4 Cover?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                This fully funded scheme provides a comprehensive improvement to your home's energy performance rating. Making homes more comfortable and cheaper to run.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Thermometer className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle>Heating Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    New boilers, heat pumps, and heating system upgrades to improve efficiency and reduce costs.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Sun className="w-8 h-8 text-yellow-600" />
                  </div>
                  <CardTitle>Solar Panels</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Solar PV (photovoltaic) panels convert light (photons) to electrons making them more suitable to Scotland's climate.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>Insulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Loft insulation, cavity wall insulation, and solid wall insulation to keep heat in and reduce energy bills.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle>Smart Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Smart thermostats and heating controls to give you better control over your energy usage.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
};

export default ECO4;
