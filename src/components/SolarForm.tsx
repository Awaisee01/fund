
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

const SolarForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptLoadError, setScriptLoadError] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);
  const hasTrackedView = useRef(false);
  const hasTrackedInteraction = useRef(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
    if (existingScript) {
      setIsScriptLoaded(true);
      setShowForm(true);
      return;
    }

    // Preload the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
      setTimeout(() => {
        setShowForm(true);
        
        // Track ViewContent when form loads
        if (!hasTrackedView.current) {
          hasTrackedView.current = true;
          import('@/services/formSubmissionService').then(({ trackViewContent }) => {
            trackViewContent('Solar Form', 'solar');
          });
        }
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load form embed script');
      setScriptLoadError(true);
    };
    
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to prevent re-loading
    };
  }, []);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setShowForm(true);
    }, 300);
  };

  const handleFormInteraction = async () => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      try {
        const { trackInitiateCheckout } = await import('@/services/formSubmissionService');
        await trackInitiateCheckout('Solar Form', 'solar');
      } catch (error) {
        console.error('❌ InitiateCheckout tracking failed:', error);
      }
    }
  };

  const handleMetaPixelClick = async () => {
    // Prevent multiple tracking calls
    if (hasTracked) {
      console.log('Tracking already called for this session');
      return;
    }

    setHasTracked(true);
    
    try {
      // Use the enhanced form submission service for full deduplication + CAPI
      const { submitFormToDatabase } = await import('@/services/formSubmissionService');
      
      // Create a proper form data object for the embedded form
      const formData = {
        serviceType: 'solar' as const,
        name: 'Solar Form User', // GoHighLevel handles actual form data
        phone: '',
        email: '',
        postcode: '',
        address: '',
        formName: 'Solar Form',
        formData: { category: 'Solar Panels' }
      };
      
      await submitFormToDatabase(formData);
      console.log('✅ Solar embedded form tracking successful');
      
      // Also trigger a custom event for Google Analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'form_submit', {
          form_name: 'solar_enquiry_form'
        });
        console.log('✅ Solar form Google Analytics tracking successful');
      }
    } catch (error) {
      console.error('❌ Solar form tracking failed:', error);
    }
  };

  if (scriptLoadError) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6 text-center">
          <p className="text-white/90 text-sm mb-4">
            Unable to load form. Please refresh the page or contact us directly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="text-center pb-0 pt-4">
          <CardTitle className="text-2xl font-bold text-white pt-2">
            Enquire Here
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-0 pb-6">
          <div className="w-full min-h-[580px] -mt-8 relative overflow-visible">
            {/* Enhanced loading state with skeleton */}
            <div 
              className={`absolute inset-0 z-10 transition-opacity duration-500 ${
                showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="p-6 space-y-4 mt-8">
                <Skeleton className="h-4 w-3/4 bg-white/30" />
                <Skeleton className="h-10 w-full bg-white/30" />
                <Skeleton className="h-4 w-1/2 bg-white/30" />
                <Skeleton className="h-10 w-full bg-white/30" />
                <Skeleton className="h-4 w-2/3 bg-white/30" />
                <Skeleton className="h-10 w-full bg-white/30" />
                <Skeleton className="h-4 w-1/3 bg-white/30" />
                <Skeleton className="h-10 w-full bg-white/30" />
                <Skeleton className="h-12 w-full bg-white/30 mt-6" />
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-white/80" />
                <p className="text-white/60 text-xs">Loading form...</p>
              </div>
            </div>

            {/* Actual form with dynamic height */}
            <div 
              className={`transition-opacity duration-500 ${
                showForm ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={handleFormInteraction}
              onFocus={handleFormInteraction}
            >
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/9lDaU9yEdGltsGe35Bwh"
                style={{
                  width:'100%', 
                  minHeight:'580px',
                  height: 'auto',
                  border:'none', 
                  borderRadius:'6px'
                }}
                id="inline-9lDaU9yEdGltsGe35Bwh" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Solar-L Form"
                data-height="580"
                data-layout-iframe-id="inline-9lDaU9yEdGltsGe35Bwh"
                data-form-id="9lDaU9yEdGltsGe35Bwh"
                title="Solar-L Form"
                onLoad={handleIframeLoad}
                onError={() => setScriptLoadError(true)}
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
    </ErrorBoundary>
  );
};

export default SolarForm;
