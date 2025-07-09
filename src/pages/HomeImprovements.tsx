import { useEffect, useState, Suspense, lazy } from 'react';
import NativeHomeImprovementsForm from '@/components/NativeHomeImprovementsForm';
import OptimizedImage from '@/components/OptimizedImage';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Lightbulb, Zap, PaintBucket } from 'lucide-react';

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
    "Repair broken/missing areas",
    "Fully breathable & hydrophobic system", 
    "10 year Guarantee",
    "Approved Installers"
  ];

  const processSteps = [
    {
      number: "1",
      title: "Survey",
      description: "Before any work can take place, a thorough assessment of the area must be completed to ensure an efficient installation and to do a risk assessment on the project.",
      image: "/lovable-uploads/e6d7f9f8-3fec-4e65-915a-0292e7eaf42a.png"
    },
    {
      number: "2", 
      title: "Clean with Anti-fungal Treatment",
      description: "The installer will clean the area with an anti-fungal agent which helps identify areas requiring repair and makes for a much better installation overall.",
      image: "/lovable-uploads/59689f9a-f212-4f4a-9657-ce728db1fd4d.png"
    },
    {
      number: "3",
      title: "Inspection", 
      description: "Careful inspection is then carried out to highlight areas requiring repair or replacement. This includes broken or bossed render and broken or missing roof tiles.",
      image: "/lovable-uploads/8e79806d-c25c-4da5-93ac-ef224e8d65fe.png"
    },
    {
      number: "4",
      title: "Repairs",
      description: "All repairs or replacement identified during the inspection are carried out to give an ideal surface for application.",
      image: "/lovable-uploads/a901cc1e-e8f7-4877-8151-dfeb1c7d9ec1.png"
    },
    {
      number: "5", 
      title: "Masking",
      description: "Windows, doors, alarm systems, etc. are all masked to protect your property as well as covering with ground sheets.",
      image: "/lovable-uploads/2809388d-08dd-4fd6-9664-8d94949886ec.png"
    },
    {
      number: "6",
      title: "Application",
      description: "Airless spray system is used to apply the breathable and hydrophobic protective coating to your walls or roof.",
      image: "/lovable-uploads/9f639358-4175-48bd-8f67-6500b1863dbc.png"
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
                Wall and Roof Renovations
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Transform the look of your property while improving energy efficiency
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Huge range of colour options. Get your free quote today.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Full Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive step-by-step approach ensures quality results and professional installation for your wall and roof renovations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <Card key={index} className="text-center h-full overflow-hidden">
                  <div className="p-4">
                    <div className="relative mb-0">
                      <OptimizedImage
                        src={step.image}
                        alt={`Step ${step.number}: ${step.title}`}
                        className="w-full h-40 object-cover rounded-lg mb-0"
                        width={400}
                        height={300}
                      />
                      <div className="w-12 h-12 mx-auto -mt-45 bg-purple-500 rounded-full flex items-center justify-center relative z-10">
                        <span className="text-xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2 mt-2">{step.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </div>
                </Card>
              ))}
            </div>
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
