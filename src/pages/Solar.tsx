
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import SolarForm from '@/components/SolarForm';
import OptimizedImage from '@/components/OptimizedImage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Battery, PoundSterling, Leaf, Home, Calculator, CheckCircle, ArrowRight, Thermometer, Heart, Shield } from 'lucide-react';

const Solar = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.title = "Free Solar Panels Scotland - Government Grants & Installation | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free solar panels in Scotland through government schemes. Reduce electricity bills by up to 70% with no upfront costs. Professional installation included.');
    }

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
    "Free solar panel installation (no upfront costs)",
    "Reduce electricity bills by up to 70%",
    "Government Feed-in Tariff payments",
    "Increase your property value significantly"
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
      title: "Benefits",
      description: "Receive any of the benefits listed below or have household income below £31,000 per year"
    }
  ];

  return (
    <div>
      <Navigation />
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-30 will-change-transform">
          <OptimizedImage
            src="/lovable-uploads/c276cb6c-c378-46e1-bd25-bb8becd28703.png"
            alt="Solar Panels Background"
            className="w-full h-full object-cover mix-blend-multiply"
            priority={true}
            style={{ 
              transform: `translate3d(0, ${scrollY * 0.3}px, 0)`
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Free Solar Panels
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Completely free solar panels.
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                If your current heating system is an Air Source Heat Pump, you could qualify for free solar through the ECO4 Scheme.
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
              <SolarForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solar Qualifying Criteria
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
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
          
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Eligibility Criteria Include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Respiratory Conditions',
                'Cardiovascular Conditions',
                'Limited Mobility',
                'Cancer Treatment/Diagnosis',
                'Autoimmune Conditions',
                'Over 65 years of age',
                'On Benefits',
                'Income below £31,000 per year',
                'Children under 5 years of age'
              ].map((condition, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solar Installation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes getting solar panels as easy as possible. From initial assessment 
              to final installation, we handle everything for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Free Assessment", description: "We assess your property's solar potential and eligibility for funding schemes." },
              { step: "2", title: "Modelling", description: "Your property's energy requirement will be assessed and layout of panels will be determined." },
              { step: "3", title: "Approval & Planning", description: "We handle all paperwork, permits, and planning permissions required." },
              { step: "4", title: "Professional Installation", description: "Certified installers complete your solar installation in 1-2 days." }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{process.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solar;
