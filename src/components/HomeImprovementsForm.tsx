
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const HomeImprovementsForm = () => {
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

  const handleMetaPixelClick = async () => {
    try {
      // Use the enhanced form submission service for full deduplication + CAPI
      const { submitFormToDatabase } = await import('@/services/formSubmissionService');
      
      // Create a proper form data object for the embedded form
      const formData = {
        serviceType: 'home_improvements' as const,
        name: 'Home Improvements Form User', // GoHighLevel handles actual form data
        phone: '',
        email: '',
        postcode: '',
        address: '',
        formName: 'Home Improvements Form',
        formData: { category: 'Home Improvements' }
      };
      
      await submitFormToDatabase(formData);
      console.log('✅ Home Improvements embedded form tracking successful');
    } catch (error) {
      console.error('❌ Home Improvements embedded form tracking failed:', error);
      // Fallback to basic pixel tracking
      import('@/lib/utm-tracking').then(({ trackLeadWithUTM }) => {
        trackLeadWithUTM({
          content_name: 'Home Improvements Form Submission',
          content_category: 'Home Improvements'
        });
      });
    }
    
    // Also trigger a custom event for Google Analytics if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        form_name: 'home_improvements_enquiry_form'
      });
    }
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
              src="https://api.leadconnectorhq.com/widget/form/FhEFg8VONN6j3hrVYYy1"
              style={{
                width:'100%', 
                height:'100%', 
                border:'none', 
                borderRadius:'6px'
              }}
              id="inline-FhEFg8VONN6j3hrVYYy1" 
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Home Improvements-L Form"
              data-height="551"
              data-layout-iframe-id="inline-FhEFg8VONN6j3hrVYYy1"
              data-form-id="FhEFg8VONN6j3hrVYYy1"
              title="Home Improvements-L Form"
              onLoad={handleIframeLoad}
            />
          </div>

          {/* Invisible overlay button positioned relatively at the bottom of the form */}
          {showForm && (
            <div className="relative -mt-16 flex justify-center z-20">
              <button
                onClick={handleMetaPixelClick}
                className="w-32 h-12 bg-transparent border-none opacity-0 cursor-pointer"
                aria-label="Submit form tracking"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeImprovementsForm;
