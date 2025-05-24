
import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Battery, PoundSterling, Leaf, Home, Calculator } from 'lucide-react';

const Solar = () => {
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
      <Hero
        title="Free Solar Panel Installation"
        subtitle="Generate Clean Energy & Save Money"
        description="Access government and energy company schemes for free solar panel installation. Start generating your own renewable energy and dramatically reduce your electricity bills."
        benefits={benefits}
        ctaText="Get Solar Quote"
        backgroundImage="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
      />
      
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Solar Savings Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Annual Savings</h4>
                <p className="text-3xl font-bold text-green-600">£800-£1,200</p>
                <p className="text-gray-600 mt-2">Typical electricity bill reduction</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">25-Year Savings</h4>
                <p className="text-3xl font-bold text-green-600">£20,000+</p>
                <p className="text-gray-600 mt-2">Total lifetime savings potential</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Property Value</h4>
                <p className="text-3xl font-bold text-green-600">+£10,000</p>
                <p className="text-gray-600 mt-2">Average property value increase</p>
              </div>
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
              { step: "2", title: "Design & Quote", description: "Our experts design a custom solar system and provide a detailed quote." },
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
