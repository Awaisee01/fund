
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import OptimizedImage from '@/components/OptimizedImage';

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Before & Afters
          </h2>
          <p className="text-lg text-gray-600">
            Roof & Wall Renovations
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {beforeAfterImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-center text-gray-800">Before</h3>
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <OptimizedImage
                          src={item.before}
                          alt={`Before: ${item.description}`}
                          className="w-full h-80 object-cover"
                          width={600}
                          height={400}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-center text-green-600">After</h3>
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <OptimizedImage
                          src={item.after}
                          alt={`After: ${item.description}`}
                          className="w-full h-80 object-cover"
                          width={600}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-gray-600 mt-6 text-lg">
                    {item.description}
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterCarousel;
