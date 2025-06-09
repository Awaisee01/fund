
import { useEffect } from 'react';

const SolarForm = () => {
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
        <p className="text-white/80 text-sm">Find out if you qualify for free solar panel installation.</p>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/9zaSDsWu48GIsRIN2JdU"
            style={{width:'100%', height:'640px', border:'none', borderRadius:'12px'}}
            id="inline-9zaSDsWu48GIsRIN2JdU" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Solar-L Form"
            data-height="640"
            data-layout-iframe-id="inline-9zaSDsWu48GIsRIN2JdU"
            data-form-id="9zaSDsWu48GIsRIN2JdU"
            title="Solar-L Form"
            className="bg-transparent"
          />
          {/* Overlay to help blend the form with the background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SolarForm;
