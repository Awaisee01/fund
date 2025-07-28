import { useState, useEffect, Suspense, lazy } from 'react';
import { CheckCircle } from 'lucide-react';

// Ultra-lazy load for mobile performance
const MobileECO4Form = lazy(() => import('@/components/MobileOptimizedECO4Form'));

interface MobileOptimizedECO4HeroProps {
  scrollY: number;
}

// Mobile-first hero component optimized for mobile Core Web Vitals
const MobileOptimizedECO4Hero = ({ scrollY }: MobileOptimizedECO4HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const benefits = [
    "Heating Upgrades",
    "Solar Panels", 
    "Insulation",
    "Free Government Backed Scheme"
  ];

  useEffect(() => {
    // Detect mobile for optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Delay form loading for mobile performance
    const formDelay = isMobile ? 800 : 200;
    const timer = setTimeout(() => {
      setFormReady(true);
    }, formDelay);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Mobile-optimized image sizes
  const imageSrc = isMobile 
    ? "/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
    : "/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png";

  return (
    <section className="relative text-white overflow-hidden min-h-screen">
      {/* Mobile-optimized background with critical resource hints */}
      <div className="absolute inset-0 w-full h-full">
        <picture>
          <source 
            media="(max-width: 767px)" 
            srcSet={imageSrc}
            width="768"
            height="1024"
          />
          <img
            src={imageSrc}
            alt="ECO4 Energy Efficiency Background"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={1920}
            height={1080}
            onLoad={() => setImageLoaded(true)}
          />
        </picture>
      </div>
      
      {/* Simplified gradient for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 to-green-600/70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start min-h-[90vh] lg:min-h-0">
          
          {/* MOBILE-FIRST: Form section always first */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {formReady ? (
                <Suspense fallback={
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                }>
                  <MobileECO4Form />
                </Suspense>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content section - Mobile optimized */}
          <div className="order-2 lg:order-1 w-full text-center lg:text-left mt-6 lg:mt-0">
            <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
              ECO4 Scheme
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl mb-3 sm:mb-6 text-blue-100 font-medium">
              Free energy efficiency upgrades for your home
            </p>
            <p className="text-sm sm:text-lg mb-4 sm:mb-8 text-blue-50 leading-relaxed hidden sm:block">
              The Westminster backed ECO4 scheme provides free heating upgrades, solar panels, and insulation to eligible households across Scotland.
            </p>
            
            {/* Mobile-optimized benefits list */}
            <div className="mb-4 sm:mb-8">
              <ul className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:space-y-3 text-left max-w-md mx-auto lg:mx-0">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-300 flex-shrink-0" />
                    <span className="text-blue-50 text-xs sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileOptimizedECO4Hero;