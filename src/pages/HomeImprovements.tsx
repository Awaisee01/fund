
import { useEffect, useState, Suspense, lazy } from 'react';
import NativeHomeImprovementsForm from '@/components/NativeHomeImprovementsForm';
import OptimizedImage from '@/components/OptimizedImage';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Thermometer, Zap, Shield, Wrench, Lightbulb, PaintBucket } from 'lucide-react';

// Lazy load below-the-fold content
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));

const HomeImprovements = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    document.title = "Free Home Improvements Scotland - Government Grants & Upgrades | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access free home improvements in Scotland through government grants. Upgrade your property with insulation, windows, doors, and energy efficiency improvements.');
    }

    setHeroLoaded(true);

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
    "Insulation upgrades",
    "Window and door replacements",
    "Energy efficiency improvements",
    "Professional installation included"
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
      description: "Properties with poor energy efficiency ratings qualify for improvements"
    },
    {
      icon: Wrench,
      title: "Improvement Areas",
      description: "Various home improvement categories including insulation, windows, and doors"
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
            src="/lovable-uploads/afaedb6c-8cc8-4d04-ab6b-bfcfcf8d836a.png"
            alt="Home Improvements Background - Modern house exterior with driveway"
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
                Free Home Improvements
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Upgrade your home at no cost
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Transform your property with government-funded home improvements. From insulation to window replacements, make your home more comfortable and energy-efficient without any upfront costs.
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
            
            <div className="flex justify-center lg:justify-end">
              <NativeHomeImprovementsForm />
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
                Home Improvements Qualifying Criteria
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
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
                What Home Improvements Are Covered?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive home improvement program covers various upgrades to make your property more comfortable and energy-efficient.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle>Insulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Loft, cavity wall, and solid wall insulation to improve your home's thermal efficiency and reduce heat loss.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>Windows & Doors</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Energy-efficient double or triple-glazed windows and doors to reduce drafts and improve security.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle>Energy Upgrades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    LED lighting, smart meters, and energy-efficient appliances to reduce your electricity consumption.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <PaintBucket className="w-8 h-8 text-orange-600" />
                  </div>
                  <CardTitle>Property Upgrades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    External wall coatings, roof repairs, and other structural improvements to enhance your property.
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

export default HomeImprovements;
