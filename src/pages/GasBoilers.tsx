import { useEffect, useState } from 'react';
import GasBoilersForm from '@/components/GasBoilersForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ThermometerSun, PoundSterling, Shield, Wrench, Clock, CheckCircle } from 'lucide-react';

const GasBoilers = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.title = "Free Gas Boiler Replacement Scotland - ECO4 & Government Grants | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get a free gas boiler replacement in Scotland through government funding schemes. Reduce heating bills by 40% with professional Gas Safe installation.');
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    "Free boiler replacement through government schemes",
    "Reduce heating bills by up to 40%",
    "10-year manufacturer warranty included",
    "Professional installation by Gas Safe engineers"
  ];

  const boilerBenefits = [
    {
      icon: PoundSterling,
      title: "Lower Bills",
      description: "New efficient boilers can reduce your heating bills by 30-40% compared to old inefficient models."
    },
    {
      icon: ThermometerSun,
      title: "Better Comfort",
      description: "Consistent heating throughout your home with improved temperature control and reliability."
    },
    {
      icon: Shield,
      title: "Safety & Reliability",
      description: "Modern safety features and reliable performance with comprehensive warranties for peace of mind."
    },
    {
      icon: Wrench,
      title: "Professional Service",
      description: "Installation by Gas Safe registered engineers with full certification and ongoing support."
    }
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-30"
          style={{ 
            backgroundImage: `url(/lovable-uploads/b2e276c6-dcac-4400-b7e2-efab434730c4.png)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Free Gas Boilers
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Upgrade to Energy Efficient Heating
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Replace your old, inefficient boiler with a brand new, high-efficiency model through government and energy company funding schemes. Reduce your heating bills and improve home comfort.
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
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 flex flex-col justify-center max-w-sm mx-auto">
                <h3 className="text-lg font-bold mb-4 text-center">Enquire Here</h3>
                <GasBoilersForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits of a New Gas Boiler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern gas boilers are significantly more efficient than older models, offering better performance, 
              lower running costs, and improved reliability for your home heating system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {boilerBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <Icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
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
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Boiler Efficiency Comparison
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md border-2 border-red-200">
                <h4 className="text-lg font-semibold text-red-600 mb-4 text-center">Old Inefficient Boiler</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    60-70% efficiency rating
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Higher fuel bills
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Frequent breakdowns
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Inconsistent heating
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border-2 border-green-200">
                <h4 className="text-lg font-semibold text-green-600 mb-4 text-center">New Efficient Boiler</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    90%+ efficiency rating
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Reduced fuel bills
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Reliable performance
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Even temperature control
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Boiler Installation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our professional team handles everything from assessment to installation, ensuring you get 
              the best boiler for your home with minimal disruption.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Assessment & Quote", 
                description: "Free home assessment to determine the best boiler size and type for your property's needs." 
              },
              { 
                icon: Clock, 
                title: "Quick Installation", 
                description: "Professional installation typically completed in 1 day by Gas Safe registered engineers." 
              },
              { 
                icon: Wrench, 
                title: "Ongoing Support", 
                description: "10-year warranty plus ongoing maintenance support to keep your boiler running efficiently." 
              }
            ].map((process, index) => {
              const Icon = process.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {process.title}
                  </h3>
                  <p className="text-gray-600">
                    {process.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GasBoilers;
