
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SolarForm = () => {
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Initial delay to let form start loading
    const initialTimer = setTimeout(() => {
      setIsFormLoaded(true);
    }, 1500);

    // Additional delay for smooth transition
    const showTimer = setTimeout(() => {
      setShowForm(true);
    }, 2200);

    return () => {
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      clearTimeout(initialTimer);
      clearTimeout(showTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setIsFormLoaded(true);
      setTimeout(() => setShowForm(true), 400);
    }, 300);
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-0 pt-4">
        <CardTitle className="text-2xl font-bold text-white pt-2">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="w-full h-[580px] -mt-8 relative overflow-hidden">
          {/* Enhanced skeleton loader */}
          <div 
            className={`absolute inset-0 z-10 p-4 space-y-3 transition-opacity duration-700 ease-out ${
              showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="space-y-3 pt-4">
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-24 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <Skeleton className="h-10 w-full bg-white/25 rounded-md" />
              <div className="flex items-center space-x-2 py-2">
                <Skeleton className="h-4 w-4 bg-white/25 rounded-sm" />
                <Skeleton className="h-4 w-3/4 bg-white/25 rounded-sm" />
              </div>
              <Skeleton className="h-12 w-full bg-white/25 rounded-md mt-4" />
            </div>
          </div>

          {/* Actual form */}
          <div 
            className={`transition-opacity duration-700 ease-out ${
              showForm ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/7a4T98Zn3bEon34CfgW0"
              style={{
                width:'100%', 
                height:'100%', 
                border:'none', 
                borderRadius:'6px'
              }}
              id="inline-7a4T98Zn3bEon34CfgW0" 
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Soalr-L Form"
              data-height="551"
              data-layout-iframe-id="inline-7a4T98Zn3bEon34CfgW0"
              data-form-id="7a4T98Zn3bEon34CfgW0"
              title="Soalr-L Form"
              onLoad={handleIframeLoad}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolarForm;
