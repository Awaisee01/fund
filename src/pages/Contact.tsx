
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, CheckCircle, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Get Your Free Consultation
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Ready to access thousands in grants and funding across Scotland? Submit your enquiry and our friendly team will help to assess your eligibility and guide you through the entire process - completely free of charge.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button 
              asChild 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20"
              variant="outline"
            >
              <Link to="/eco4">ECO4</Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20"
              variant="outline"
            >
              <Link to="/solar">Solar</Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20"
              variant="outline"
            >
              <Link to="/gas-boilers">Gas Boilers</Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20"
              variant="outline"
            >
              <Link to="/home-improvements">Home Improvements</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Image */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/634c85e5-6ae1-4b04-8017-714d5bc1c1bc.png"
                alt="Funding for Scotland advisor"
                className="rounded-2xl shadow-xl max-w-full h-auto object-cover"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Advisors</h3>
                      <p className="text-gray-600">Based in Scotland</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Coverage Area</h3>
                      <p className="text-gray-600">All of Scotland</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Response Time</h3>
                      <p className="text-gray-600">We respond to all enquiries<br />within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
                <CardHeader>
                  <CardTitle className="text-xl">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "We'll email you within 24 hours to discuss your needs",
                      "Free property assessment and eligibility check",
                      "Detailed explanation of available funding options",
                      "Professional installation arranged at no cost to you"
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
