
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ECO4CustomForm = () => {
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  useEffect(() => {
    // Load the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Set a timer to assume the form is loaded after a reasonable delay
    const loadTimer = setTimeout(() => {
      setIsFormLoaded(true);
    }, 2000);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      clearTimeout(loadTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    // Additional check when iframe loads
    setTimeout(() => {
      setIsFormLoaded(true);
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-0 pt-6">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="w-full h-[500px] -mt-12 relative">
          {!isFormLoaded && (
            <div className="absolute inset-0 z-10 p-4 space-y-4">
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-32 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-16 w-full bg-white/20" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-6 bg-white/20" />
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
              <Skeleton className="h-12 w-full bg-white/20" />
            </div>
          )}
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/cJ1J84PqSZEi3RCJZYb5"
            style={{
              width:'100%', 
              height:'100%', 
              border:'none', 
              borderRadius:'6px',
              opacity: isFormLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            id="inline-cJ1J84PqSZEi3RCJZYb5" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="ECO4-L Form"
            data-height="651"
            data-layout-iframe-id="inline-cJ1J84PqSZEi3RCJZYb5"
            data-form-id="cJ1J84PqSZEi3RCJZYb5"
            title="ECO4-L Form"
            onLoad={handleIframeLoad}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ECO4CustomForm;
