
import { useEffect } from 'react';

const HomeImprovementsForm = () => {
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Free Home Improvement Quote</h3>
        <p className="text-gray-600 text-sm">Discover what home improvement grants you may be eligible for.</p>
      </div>
      <div className="rounded-md overflow-hidden border border-gray-100">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/vFxaWHxebYlLLQxMGEc7"
          style={{width:'100%', height:'640px', border:'none', borderRadius:'3px'}}
          id="inline-vFxaWHxebYlLLQxMGEc7" 
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Home Improvements-L Form"
          data-height="640"
          data-layout-iframe-id="inline-vFxaWHxebYlLLQxMGEc7"
          data-form-id="vFxaWHxebYlLLQxMGEc7"
          title="Home Improvements-L Form"
        />
      </div>
    </div>
  );
};

export default HomeImprovementsForm;
