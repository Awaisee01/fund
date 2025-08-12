import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { SquareCheckbox } from '@/components/ui/square-checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Import enhanced tracking system
import { 
  initializeTracking, 
  trackFormSubmission, 
  trackEnrichedPageView,
  trackFormStart
} from '@/lib/unified-tracking-manager';

const SimpleSolarForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formStartTracked, setFormStartTracked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    postCode: '',
    email: '',
    phone: '',
    understand: false
  });

  // Enhanced initialization with rich page view tracking
  useEffect(() => {
    const initializeTrackingSystem = async () => {
      try {
        await initializeTracking();
        await trackEnrichedPageView();
      } catch (error) {
        console.error('❌ Failed to initialize tracking system:', error);
        // Silent error handling for production
      }
    };
    
    initializeTrackingSystem();
  }, []);

  // Handle form start tracking
  const handleFormStart = async () => {
    if (!formStartTracked) {
      try {
        await trackFormStart('solar');
        setFormStartTracked(true);
      } catch (error) {
        console.error('❌ Failed to track form start:', error);
        // Silent error handling for production
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.postCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidPhoneNumber(formData.phone, 'GB')) {
      toast.error("Please enter a valid UK phone number");
      return;
    }

    if (!formData.understand) {
      toast.error("Please confirm you understand the requirements");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { data, error } = await supabase.functions.invoke('secure-form-submission', {
        body: {
          name: formData.fullName || 'Solar Customer',
          email: formData.email || null,
          phone: formData.phone || null,
          postcode: formData.postCode || null,
          service_type: 'solar',
          form_data: {
            address: formData.address || null,
            understand_roof_requirement: formData.understand || false,
            source: 'solar_form_enhanced_tracking',
            full_profile_provided: true,
            lead_quality_indicators: {
              complete_contact_info: true,
              valid_uk_phone: true,
              full_address_provided: !!formData.address,
              understands_roof_requirements: formData.understand,
              service_interest: 'premium_solar_installation'
            }
          },
          page_path: window.location.pathname || '/solar'
        }
      });

      if (error) {
        throw new Error(`Submission failed: ${error.message}`);
      }

      // Enhanced Facebook tracking with rich customer data
      const richCustomerData = {
        email: formData.email,
        phone: formData.phone,
        fullName: formData.fullName,
        firstName: formData.fullName.split(' ')[0] || '',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        postcode: formData.postCode,
        address: formData.address,
        county: extractCountyFromAddress(formData.address),
        
        // Enhanced Solar data
        service_interest: 'solar',
        understands_roof_requirements: formData.understand,
        renewable_energy_interest: true,
        property_type: 'residential_with_roof',
        lead_tier: 'premium',
        form_completion_quality: 'high',
        lead_source: 'solar_form',
        customer_segment: 'eco_conscious_homeowner',
        
        // Rich engagement data
        form_start_tracked: formStartTracked,
        session_engagement: 'complete_form_journey',
        conversion_funnel_stage: 'form_completion',
        user_intent_strength: 'high',
        investment_readiness: 'high'
      };

      try {
        await trackFormSubmission('solar', richCustomerData);
      } catch (trackingError) {
        console.error('❌ Enhanced tracking failed:', trackingError);
        // Fallback: Direct Facebook Pixel call
        if ((window as any).fbq) {
          try {
            (window as any).fbq('track', 'Lead', {
              content_name: 'Solar Enhanced Premium Lead',
              content_category: 'lead_generation',
              value: 100,
              currency: 'GBP',
              user_email: formData.email,
              user_phone: formData.phone,
              user_postcode: formData.postCode,
              predicted_ltv: 12000,
              lead_quality: 'premium',
              service_type: 'solar'
            });

            (window as any).fbq('track', 'CompleteRegistration', {
              content_name: 'Solar Premium Lead Registration',
              value: 12000,
              currency: 'GBP',
              registration_method: 'enhanced_form'
            });
          } catch (directError) {
            console.error('❌ Direct Facebook Pixel tracking failed:', directError);
            // Silent fallback error handling
          }
        }
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success("Thank you for your enquiry! We will be in touch within 24 hours.");
      
      // Reset form
      setFormData({
        fullName: '',
        address: '',
        postCode: '',
        email: '',
        phone: '',
        understand: false
      });
      
      setFormStartTracked(false);
      setTimeout(() => setShowSuccess(false), 10000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      
      // Still show success to user
      setShowSuccess(true);
      toast.success("Thank you for your enquiry! We will be in touch within 24 hours.");
      
      // Reset form
      setFormData({
        fullName: '',
        address: '',
        postCode: '',
        email: '',
        phone: '',
        understand: false
      });
      
      setFormStartTracked(false);
      setTimeout(() => setShowSuccess(false), 10000);
    }
  };

  // Enhanced helper function to extract county
  const extractCountyFromAddress = (address: string): string => {
    if (!address) return '';
    
    const scottishCounties = [
      'Aberdeenshire', 'Angus', 'Argyll and Bute', 'Ayrshire', 'Banffshire', 
      'Edinburgh', 'Falkirk', 'Fife', 'Glasgow', 'Highland', 'Inverclyde',
      'Midlothian', 'Moray', 'Perth and Kinross', 'Renfrewshire', 'Stirling',
      'Dumfries and Galloway', 'South Lanarkshire', 'North Lanarkshire',
      'East Lothian', 'West Lothian', 'Scottish Borders', 'Orkney', 'Shetland'
    ];
    
    const scottishCities = [
      'Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee', 'Stirling', 'Perth',
      'Inverness', 'Paisley', 'East Kilbride', 'Livingston', 'Hamilton',
      'Kirkcaldy', 'Ayr', 'Kilmarnock', 'Greenock'
    ];
    
    const upperAddress = address.toUpperCase();
    
    for (const county of scottishCounties) {
      if (upperAddress.includes(county.toUpperCase())) {
        return county;
      }
    }
    
    for (const city of scottishCities) {
      if (upperAddress.includes(city.toUpperCase())) {
        return city;
      }
    }
    
    return 'Scotland';
  };

  if (showSuccess) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-green-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
          <p className="text-white/90 text-base leading-relaxed">
            We have received your enquiry and will be in touch within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
        <p className="text-xs text-white/70 mt-1">
          Free solar panels to cut bills and boost value.
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-xs block mb-1">Full Name</label>
            <Input 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              onFocus={handleFormStart}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="Enter your full name"
              enterKeyHint="next"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Address</label>
            <Input 
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              onFocus={handleFormStart}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="Enter your address"
              enterKeyHint="next"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Post Code</label>
            <Input 
              required
              value={formData.postCode}
              onChange={(e) => setFormData({...formData, postCode: e.target.value})}
              onFocus={handleFormStart}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="G1 1AA"
              enterKeyHint="next"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Email</label>
            <Input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onFocus={handleFormStart}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="your.email@example.com"
              enterKeyHint="next"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Phone</label>
            <PhoneInput 
              required
              value={formData.phone}
              onChange={(value) => setFormData({...formData, phone: value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="07xxx xxx xxx"
            />
          </div>

          <div className="pt-2">
            <p className="text-white text-sm text-left mb-3 font-bold">
              * Must own property with good south-facing roof space
            </p>
            
            <div className="flex flex-row items-center space-x-3">
              <SquareCheckbox
                required
                checked={formData.understand}
                onCheckedChange={(checked) => setFormData({...formData, understand: !!checked})}
              />
              <label 
                className="text-white text-sm cursor-pointer"
                onClick={() => setFormData({...formData, understand: !formData.understand})}
              >
                I understand
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold h-12 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </Button>
          
          {/* {isSubmitting && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="ml-2 text-white text-sm">Sending premium customer profile...</span>
            </div>
          )} */}
        </form>
        
        {/* <div className="mt-3 text-xs text-white/60 text-center space-y-1">
          <p>☀️ Enhanced tracking: {formStartTracked ? '✅ Active' : '⏳ Ready'}</p>
          <p>📊 Maximum Facebook optimization enabled</p>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default SimpleSolarForm;