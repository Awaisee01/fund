
import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Window, Paintbrush2, Shield, DoorOpen, Hammer } from 'lucide-react';

const HomeImprovements = () => {
  const benefits = [
    "Comprehensive home improvement grants available",
    "Windows, doors, roofing, and rendering covered",
    "Increase property value by up to £30,000",
    "Improve energy efficiency and reduce bills"
  ];

  const improvements = [
    {
      icon: Window,
      title: "Windows & Doors",
      description: "Energy-efficient double or triple glazing, composite doors, and UPVC installations.",
      funding: "Up to £8,000"
    },
    {
      icon: Home,
      title: "Roofing Services",
      description: "New roofs, roof repairs, and roof insulation to protect your home and improve efficiency.",
      funding: "Up to £12,000"
    },
    {
      icon: Paintbrush2,
      title: "External Rendering",
      description: "Modern rendering systems that improve insulation and give your home a fresh new look.",
      funding: "Up to £15,000"
    },
    {
      icon: Shield,
      title: "Insulation Upgrades",
      description: "External wall insulation, loft insulation, and cavity wall treatments for better efficiency.",
      funding: "Up to £10,000"
    }
  ];

  return (
    <div>
      <Hero
        title="Home Improvement Grants"
        subtitle="Transform Your Home with Government Funding"
        description="Access a wide range of grants and funding for home improvements including windows, doors, roofing, rendering, and energy efficiency upgrades. Enhance your property value and comfort."
        benefits={benefits}
        ctaText="Explore Funding Options"
        backgroundImage="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80"
      />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Home Improvement Grants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help you access various Scottish government and council grants for comprehensive home improvements 
              that increase your property value and reduce energy costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {improvements.map((improvement, index) => {
              const Icon = improvement.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                        <Icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{improvement.title}</CardTitle>
                        <p className="text-green-600 font-semibold">{improvement.funding}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {improvement.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Home Transformation Package
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Combine multiple improvement grants to completely transform your home. Our experts will identify 
                all available funding opportunities for your specific situation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Basic Package</h4>
                <p className="text-3xl font-bold text-green-600">Up to £8,000</p>
                <p className="text-gray-600 mt-2">Windows & doors upgrade</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md border-2 border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Standard Package</h4>
                <p className="text-3xl font-bold text-green-600">Up to £15,000</p>
                <p className="text-gray-600 mt-2">Plus roofing improvements</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Package</h4>
                <p className="text-3xl font-bold text-green-600">Up to £25,000</p>
                <p className="text-gray-600 mt-2">Complete home transformation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Invest in Home Improvements?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic home improvements not only enhance your living experience but also provide excellent 
              return on investment through increased property value and reduced running costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: "📈", 
                title: "Increase Value", 
                description: "Home improvements can increase property value by 15-30%" 
              },
              { 
                icon: "💰", 
                title: "Reduce Bills", 
                description: "Energy efficient upgrades cut heating and cooling costs" 
              },
              { 
                icon: "🏠", 
                title: "Better Comfort", 
                description: "Improved insulation and heating create year-round comfort" 
              },
              { 
                icon: "🛡️", 
                title: "Future-Proof", 
                description: "Modern improvements protect against future maintenance issues" 
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeImprovements;
