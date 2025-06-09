
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
    <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Free Solar Assessment</h3>
        <p className="text-gray-600 text-sm">Find out if you qualify for free solar panel installation.</p>
      </div>
      <div className="rounded-md overflow-hidden border border-gray-100">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/9zaSDsWu48GIsRIN2JdU"
          style={{width:'100%', height:'640px', border:'none', borderRadius:'3px'}}
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
        />
      </div>
    </div>
  );
};

export default SolarForm;
