
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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

  // Flatten the images for horizontal scrolling
  const allImages = beforeAfterImages.flatMap(item => [
    { src: item.before, alt: `${item.description} - Before` },
    { src: item.after, alt: `${item.description} - After` }
  ]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Before & Afters
          </h2>
          <p className="text-lg text-gray-600">
            Roof & Wall Renovations
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {allImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                  <Card className="border shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={300}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-8 w-8 bg-white/90 hover:bg-white shadow-md" />
            <CarouselNext className="right-2 h-8 w-8 bg-white/90 hover:bg-white shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterCarousel;
