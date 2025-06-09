
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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Enquire Here</h3>
        <p className="text-white/80 text-sm">Discover what home improvement grants you may be eligible for.</p>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/vFxaWHxebYlLLQxMGEc7"
          style={{width:'100%', height:'640px', border:'none', borderRadius:'12px'}}
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
