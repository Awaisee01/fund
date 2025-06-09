
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ECO4CustomForm = () => {
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
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[651px]">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/cJ1J84PqSZEi3RCJZYb5"
            style={{width:'100%', height:'100%', border:'none', borderRadius:'6px'}}
            id="inline-cJ1J84PqSZEi3RCJZYb5" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="ECO4-L Form"
            data-height="651"
            data-layout-iframe-id="inline-cJ1J84PqSZEi3RCJZYb5"
            data-form-id="cJ1J84PqSZEi3RCJZYb5"
            title="ECO4-L Form"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ECO4CustomForm;
