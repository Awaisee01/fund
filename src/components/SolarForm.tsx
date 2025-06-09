
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SolarForm = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Show form after a delay to ensure it's loaded
    const showTimer = setTimeout(() => {
      setShowForm(true);
    }, 2000);

    return () => {
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      clearTimeout(showTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setShowForm(true);
    }, 500);
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
          {/* Loading spinner */}
          <div 
            className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ${
              showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <Loader2 className="h-8 w-8 animate-spin text-white/80" />
          </div>

          {/* Actual form */}
          <div 
            className={`transition-opacity duration-500 ${
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
