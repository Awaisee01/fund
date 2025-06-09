import { useEffect, useState } from 'react';
import SolarForm from '@/components/SolarForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Battery, PoundSterling, Leaf, Home, Calculator, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Solar = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.title = "Free Solar Panels Scotland - Government Grants & Installation | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free solar panels in Scotland through government schemes. Reduce electricity bills by up to 70% with no upfront costs. Professional installation included.');
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    "Free solar panel installation (no upfront costs)",
    "Reduce electricity bills by up to 70%",
    "Government Feed-in Tariff payments",
    "Increase your property value significantly"
  ];

  const solarBenefits = [
    {
      icon: PoundSterling,
      title: "Save Money",
      description: "Reduce your electricity bills by up to £1,200 per year with free solar energy from the sun."
    },
    {
      icon: Leaf,
      title: "Go Green",
      description: "Reduce your carbon footprint and contribute to Scotland's renewable energy goals."
    },
    {
      icon: Battery,
      title: "Energy Storage",
      description: "Optional battery storage systems to store excess energy for use when the sun isn't shining."
    },
    {
      icon: Home,
      title: "Increase Value",
      description: "Solar panels can increase your property value by up to £10,000 according to recent studies."
    }
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-30"
          style={{ 
            backgroundImage: `url(/lovable-uploads/c276cb6c-c378-46e1-bd25-bb8becd28703.png)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Free Solar Panels
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Generate Clean Energy & Save Money
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Access government and energy company schemes for free solar panel installation. Start generating your own renewable energy and dramatically reduce your electricity bills.
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
            
            <div className="hidden lg:block relative">
              <SolarForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Solar Panels?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solar panels are one of the best investments you can make for your home. With Scottish government 
              support and various funding schemes, you can get them installed completely free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solarBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                        <Icon className="w-6 h-6 text-yellow-600 group-hover:text-white transition-colors" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
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
