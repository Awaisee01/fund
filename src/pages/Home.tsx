
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
      title: "ECO4 Grants",
      description: "Access up to £25,000 in government grants for insulation, heating, and energy efficiency improvements.",
      amount: "Up to £25,000",
      link: "/eco4"
    },
    {
      icon: Zap,
      title: "Solar Panel Installation",
      description: "Free solar panel installations through government schemes. Reduce your energy bills significantly.",
      amount: "Up to £15,000",
      link: "/solar"
    },
    {
      icon: Flame,
      title: "Gas Boiler Replacement",
      description: "Replace your old boiler with a new, energy-efficient model through various funding schemes.",
      amount: "Up to £7,000",
      link: "/gas-boilers"
    },
    {
      icon: Wrench,
      title: "Home Improvements",
      description: "Comprehensive home improvement grants covering windows, doors, roofing, and rendering.",
      amount: "Up to £20,000",
      link: "/home-improvements"
    }
  ];

  return (
    <div>
      <Hero
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="We help people in Scotland access local authority schemes, government backed schemes, and other grants around Scotland. Chat with our advisors today and find out what you're entitled to."
        benefits={[
          "Free eligibility assessment",
          "Nothing to pay, we're a free advice group",
          "Guidance through the whole process",
          "Friendly team ready to chat"
        ]}
      />
      
      <TrustBadges />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Funding Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in helping Scottish homeowners access a wide range of grants and funding opportunities 
              to improve their homes, reduce energy bills, and increase property value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <p className="text-green-600 font-semibold">{service.amount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-6">
                      {service.description}
                    </CardDescription>
                    <Button asChild className="w-full" variant="outline">
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
      
      <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Access Your Funding?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't miss out on thousands of pounds in available grants. Our expert team will assess your eligibility 
            and guide you through the entire application process - completely free of charge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold" asChild>
              <Link to="/contact">
                Get Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold" asChild>
              <a href="tel:+441234567890">
                Call: 0123 456 7890
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
