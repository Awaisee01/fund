
import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Thermometer, Zap, Shield } from 'lucide-react';

const ECO4 = () => {
  const benefits = [
    "Free home insulation (loft, cavity wall, solid wall)",
    "Free heating system upgrades and replacements",
    "Energy-efficient windows and doors",
    "Smart heating controls and thermostats"
  ];

  const eligibilityRequirements = [
    {
      icon: Home,
      title: "Property Type",
      description: "Own or privately rent your home in Scotland"
    },
    {
      icon: Thermometer,
      title: "Energy Rating",
      description: "Property has EPC rating of D, E, F, or G"
    },
    {
      icon: Shield,
      title: "Benefits",
      description: "Receive certain benefits or have low household income"
    },
    {
      icon: Zap,
      title: "Health Conditions",
      description: "Vulnerable to cold or have certain health conditions"
    }
  ];

  return (
    <div>
      <Hero
        title="ECO4 Grants"
        subtitle="Up to £25,000 in Free Home Improvements"
        description="The ECO4 scheme provides funding for energy efficiency improvements to help reduce your heating bills and make your home warmer. As approved consultants, we'll handle your entire application process."
        benefits={benefits}
        ctaText="Check ECO4 Eligibility"
        backgroundImage="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
      />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Does ECO4 Cover?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ECO4 is the government's flagship energy efficiency scheme, providing comprehensive home improvements 
              to make your property warmer, more comfortable, and cheaper to heat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ECO4 Eligibility Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check if you qualify for ECO4 funding. We'll verify your eligibility and handle the entire application process for you.
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
          
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Qualifying Benefits Include:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Universal Credit',
                'Employment and Support Allowance',
                'Jobseeker\'s Allowance',
                'Income Support',
                'Working Tax Credit',
                'Child Tax Credit',
                'Pension Credit',
                'Housing Benefit',
                'Council Tax Reduction'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ECO4;
