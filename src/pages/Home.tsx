
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home as HomeIcon, Zap, Flame, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const services = [
    {
      icon: HomeIcon,
      title: "ECO4 Funding",
      description: "Heating upgrades, solar panels, and insulation completely free of charge. See if you qualify.",
      link: "/eco4"
    },
    {
      icon: Zap,
      title: "Solar Panels",
      description: "Free Solar Panels through a government backed scheme to help reduce your energy bills.",
      link: "/solar"
    },
    {
      icon: Flame,
      title: "Gas Boiler Replacement",
      description: "Replace your old boiler with a new energy efficient model through this funding scheme.",
      link: "/gas-boilers"
    },
    {
      icon: Wrench,
      title: "Home Improvements",
      description: "Including rendering, re-roofing, windows, and doors. Access grants for home improvements here.",
      link: "/home-improvements"
    }
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Unlock Scottish Grants & Funding
              </h1>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                We help people in Scotland access local authority schemes, government backed schemes, and other grants around Scotland. Chat with our advisors today and find out what you're entitled to.
              </p>
              
              <div className="mb-8">
                <ul className="space-y-3">
                  {[
                    "Free eligibility assessment",
                    "Nothing to pay, we're a free advice group",
                    "Guidance through the whole process",
                    "Friendly team ready to chat"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="h-6 w-6 text-green-300 flex-shrink-0">✓</div>
                      <span className="text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6 text-center">What can we help with?</h3>
                <div className="space-y-4">
                  <Button 
                    asChild 
                    className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20"
                    variant="outline"
                  >
                    <Link to="/eco4">
                      ECO4
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20"
                    variant="outline"
                  >
                    <Link to="/solar">
                      Solar Panels
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20"
                    variant="outline"
                  >
                    <Link to="/gas-boilers">
                      Gas Boilers
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20"
                    variant="outline"
                  >
                    <Link to="/home-improvements">
                      Home Improvements
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Funding Schemes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the various government-backed schemes and grants available to help you improve your home and reduce energy costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6">
                      {service.description}
                    </CardDescription>
                    <Button asChild className="w-full">
                      <Link to={service.link}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Access Your Funding?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't miss out on thousands of pounds in available grants. Our expert team will assess your eligibility 
            and guide you through the entire application process - completely free of charge.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-4 text-lg font-semibold" asChild>
              <Link to="/contact">
                Submit Enquiry Form
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
