
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from '@/components/OptimizedImage';
import { Badge } from "@/components/ui/badge";

const BeforeAfterCarousel = () => {
  const beforeAfterImages = [
    {
      before: "/lovable-uploads/245736bc-2f67-4f44-938d-82fa05111548.png",
      after: "/lovable-uploads/37194ab7-973a-40fd-88f1-80936afde467.png",
      description: "Roof tile restoration and cleaning"
    },
    {
      before: "/lovable-uploads/991d80f9-0561-47ed-a877-8ca0a2f7222e.png", 
      after: "/lovable-uploads/8f34acb2-5ccb-494b-ad5e-22b2431b36ed.png",
      description: "Complete roof renovation and coating"
    },
    {
      before: "/lovable-uploads/415da1c4-2239-44b4-8f43-e535e749984b.png",
      after: "/lovable-uploads/f40577a6-0070-4534-a178-a326c9a839eb.png", 
      description: "Roof and exterior wall transformation"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Before & Afters
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Roof & Wall Renovations
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <Carousel className="w-full" opts={{ align: "center", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {beforeAfterImages.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4">
                  <Card className="border-0 shadow-2xl overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Before Image */}
                        <div className="relative h-80 md:h-96 overflow-hidden">
                          <OptimizedImage
                            src={item.before}
                            alt={`Before: ${item.description}`}
                            className="w-full h-full object-cover"
                            width={800}
                            height={400}
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute top-4 left-4 bg-red-100 text-red-800 font-semibold"
                          >
                            BEFORE
                          </Badge>
                        </div>
                        
                        {/* Divider */}
                        <div className="relative h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* After Image */}
                        <div className="relative h-80 md:h-96 overflow-hidden">
                          <OptimizedImage
                            src={item.after}
                            alt={`After: ${item.description}`}
                            className="w-full h-full object-cover"
                            width={800}
                            height={400}
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute top-4 right-4 bg-green-100 text-green-800 font-semibold"
                          >
                            AFTER
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 text-center">
                          {item.description}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-12 w-12 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
            <CarouselNext className="right-4 h-12 w-12 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
          </Carousel>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {beforeAfterImages.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterCarousel;
