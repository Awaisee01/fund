import { useState, useEffect, Suspense, lazy } from 'react';
import { CheckCircle } from 'lucide-react';

// Lazy load the form for optimal performance
const NativeECO4Form = lazy(() => import('@/components/NativeECO4Form'));

interface CriticalECO4HeroProps {
  scrollY: number;
}

// Critical hero component with minimal dependencies for fast rendering
const CriticalECO4Hero = ({ scrollY }: CriticalECO4HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [formReady, setFormReady] = useState(false);

  const benefits = [
    "Heating Upgrades",
    "Solar Panels", 
    "Insulation",
    "Free Government Backed Scheme"
  ];

  useEffect(() => {
    // Load form after hero renders
    const timer = setTimeout(() => {
      setFormReady(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative hero-gradient text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 opacity-30 will-change-transform">
        <div 
          className="hero-image-container w-full h-full"
          style={{ 
            transform: `translate3d(0, ${scrollY * 0.3}px, 0)`
          }}
        >
          <img
            src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
            alt="ECO4 Energy Efficiency Background - Aerial view of modern Scottish houses with solar panels"
            className="w-full h-full object-cover mix-blend-multiply"
            loading="eager"
            fetchPriority="high"
            width={1920}
            height={1080}
            onLoad={() => setImageLoaded(true)}
            style={{ 
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              ECO4 Scheme
            </h1>
            <p className="text-xl lg:text-2xl mb-6 hero-text-blue-100 font-medium">
              Free energy efficiency upgrades for your home
            </p>
            <p className="text-lg mb-8 hero-text-blue-50 leading-relaxed">
              The Westminster backed ECO4 scheme provides free heating upgrades, solar panels, and insulation to eligible households across Scotland.
            </p>
            
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
          </div>
          
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="w-full max-w-md">
              {formReady ? (
                <Suspense fallback={
                  <div className="form-card p-6">
                    <div className="text-center">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                        <div className="h-10 bg-gray-300 rounded"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">Loading form...</p>
                    </div>
                  </div>
                }>
                  <NativeECO4Form />
                </Suspense>
              ) : (
                <div className="form-card p-6">
                  <div className="text-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Loading form...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CriticalECO4Hero;