
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GasBoilersForm = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Show form after a longer delay to ensure it's fully loaded
    const showTimer = setTimeout(() => {
      setShowForm(true);
    }, 3000);

    return () => {
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      clearTimeout(showTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    // Add extra delay after iframe loads to ensure form is fully rendered
    setTimeout(() => {
      setShowForm(true);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-0 pt-4">
        <CardTitle className="text-2xl font-bold text-white pt-2">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="w-full min-h-[580px] -mt-8 relative overflow-hidden">
          {/* Loading spinner */}
          <div 
            className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-700 ${
              showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-white/80" />
              <p className="text-white/60 text-sm">Loading form...</p>
            </div>
          </div>

          {/* Actual form */}
          <div 
            className={`transition-opacity duration-700 ${
              showForm ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/IQdjy6881LRm0K7ogyiF"
              style={{
                width:'100%', 
                height:'580px', 
                border:'none', 
                borderRadius:'6px'
              }}
              id="inline-IQdjy6881LRm0K7ogyiF" 
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Gas Boilers-L Form"
              data-height="580"
              data-layout-iframe-id="inline-IQdjy6881LRm0K7ogyiF"
              data-form-id="IQdjy6881LRm0K7ogyiF"
              title="Gas Boilers-L Form"
              onLoad={handleIframeLoad}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GasBoilersForm;
