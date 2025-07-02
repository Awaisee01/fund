
import { useEffect } from 'react';

const ECO4Form = () => {
  useEffect(() => {
    // Load the GoHighLevel form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleMetaPixelClick = () => {
    // Trigger Meta Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'ECO4 Form Submission',
        content_category: 'ECO4 Grants'
      });
    }
    
    // Also trigger a custom event for Google Analytics if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        form_name: 'eco4_enquiry_form'
      });
    }
  };

  return (
    <div className="w-fit mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center text-white">Enquire Here</h3>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm w-[320px] relative">
        <div className="relative p-2 min-h-[640px] overflow-visible">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/cJ1J84PqSZEi3RCJZYb5"
            style={{
              width:'300px', 
              minHeight:'640px',
              height: 'auto',
              border:'none', 
              borderRadius:'8px'
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
            data-height="640"
            data-layout-iframe-id="inline-cJ1J84PqSZEi3RCJZYb5"
            data-form-id="cJ1J84PqSZEi3RCJZYb5"
            title="ECO4-L Form"
            className="bg-transparent mx-auto block"
          />
          {/* Overlay to help blend the form with the background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-xl"></div>
          
          {/* Invisible overlay button positioned relatively at the bottom of the form */}
          <div className="relative -mt-16 flex justify-center z-20">
            <button
              onClick={handleMetaPixelClick}
              className="w-32 h-12 bg-transparent border-none opacity-0 cursor-pointer"
              aria-label="Submit form tracking"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECO4Form;
