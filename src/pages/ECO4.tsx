
import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Thermometer, Zap, Shield, Sun, Heart } from 'lucide-react';

const ECO4 = () => {
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
      <Hero
        title="ECO4 Funding"
        subtitle="Completely free heating upgrades, solar panels, and insulation"
        description="The primary goal of the ECO4 scheme is to improve energy efficiency in homes, reduce carbon emissions, tackle fuel poverty, and support the UK's commitment to net-zero carbon emissions by 2050."
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
      
      <section className="py-20 bg-gray-50">
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
    </div>
  );
};

export default ECO4;
