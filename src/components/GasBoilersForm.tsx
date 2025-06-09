
import { useEffect } from 'react';

const GasBoilersForm = () => {
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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Enquire Here</h3>
        <p className="text-white/80 text-sm">Check if you qualify for a free boiler replacement through government schemes.</p>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/AfUd4L7f3p8h5HZvBwex"
            style={{width:'100%', height:'640px', border:'none', borderRadius:'12px'}}
            id="inline-AfUd4L7f3p8h5HZvBwex" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Gas Boilers-L Form"
            data-height="640"
            data-layout-iframe-id="inline-AfUd4L7f3p8h5HZvBwex"
            data-form-id="AfUd4L7f3p8h5HZvBwex"
            title="Gas Boilers-L Form"
            className="bg-transparent"
          />
          {/* Overlay to help blend the form with the background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default GasBoilersForm;
