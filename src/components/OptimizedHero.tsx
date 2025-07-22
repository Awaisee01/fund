import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface OptimizedHeroProps {
  title: string;
  subtitle: string;
  description: string;
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const OptimizedHero = ({ 
  title, 
  subtitle, 
  description, 
  benefits = [], 
  ctaText = "Get Free Consultation",
  ctaLink = "/contact",
  backgroundImage 
}: OptimizedHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Delay background image loading until after critical content is visible
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="relative hero-gradient text-white overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Optimized background image loading with new WebP hero */}
      {showImage && (
        <div className="absolute inset-0 opacity-40">
          <picture>
            <source 
              media="(max-width: 768px)" 
              srcSet="/lovable-uploads/9c72256e-c008-468d-8fb8-782177d8fddb.png?w=768&q=75" 
              type="image/webp"
            />
            <source 
              media="(max-width: 1200px)" 
              srcSet="/lovable-uploads/9c72256e-c008-468d-8fb8-782177d8fddb.png?w=1200&q=80" 
              type="image/webp"
            />
            <img
              src="/lovable-uploads/9c72256e-c008-468d-8fb8-782177d8fddb.png"
              alt="Scottish houses with solar panels - Government funding background"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              width={1920}
              height={1080}
              onLoad={handleImageLoad}
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          </picture>
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        {/* Text-first layout for LCP optimization */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content Section - Priority for LCP */}
          <div className="order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xl lg:text-2xl mb-6 hero-text-blue-100 font-medium">{subtitle}</p>
            )}
            <p className="text-lg hero-text-blue-50 leading-relaxed mb-8">{description}</p>
            
            {benefits.length > 0 && (
              <div className="mb-8">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 hero-text-green-300 flex-shrink-0" />
                      <span className="hero-text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Form Section - Deferred to improve LCP */}
          <div className="order-2 w-full flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-6 xl:px-8 py-6 xl:py-8 border border-white/20 w-full max-w-md">
              <h3 className="text-lg sm:text-xl xl:text-2xl font-bold mb-4 xl:mb-6 text-center">What can we help with?</h3>
              <div className="grid grid-cols-1 gap-3 xl:gap-4">
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/eco4">
                    ECO4
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/solar">
                    Solar Panels
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/gas-boilers">
                    Gas Boilers
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
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
  );
};

export default OptimizedHero;