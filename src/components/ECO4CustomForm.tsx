
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ECO4CustomForm = () => {
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

  const handleMetaPixelClick = () => {
    console.log('Tracking button clicked');
    // Import and use enhanced UTM tracking
    import('@/lib/utm-tracking').then(({ trackLeadWithUTM }) => {
      trackLeadWithUTM({
        content_name: 'ECO4 Form Submission',
        content_category: 'ECO4 Grants'
      });
    });
    
    // Also trigger a custom event for Google Analytics if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        form_name: 'eco4_enquiry_form'
      });
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-2 pt-4">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0 pb-6">
        <div className="w-full min-h-[580px] relative overflow-visible">
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

          {/* Actual form with dynamic height */}
          <div 
            className={`transition-opacity duration-700 ${
              showForm ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/cJ1J84PqSZEi3RCJZYb5"
              style={{
                width:'100%', 
                minHeight:'580px',
                height: 'auto',
                border:'none', 
                borderRadius:'6px'
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
              data-height="580"
              data-layout-iframe-id="inline-cJ1J84PqSZEi3RCJZYb5"
              data-form-id="cJ1J84PqSZEi3RCJZYb5"
              title="ECO4-L Form"
              onLoad={handleIframeLoad}
            />
          </div>

          {/* Tracking button - positioned to not interfere with form submission */}
          {showForm && (
            <button
              onClick={handleMetaPixelClick}
              className="absolute top-2 right-2 w-8 h-8 bg-transparent border-none opacity-0 cursor-pointer z-30"
              aria-label="Form tracking"
              tabIndex={-1}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ECO4CustomForm;
