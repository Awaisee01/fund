import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitFormToDatabase, trackViewContent } from '@/services/formSubmissionService';
import { trackRobustEvent, captureLocationData, captureUTMData } from '@/lib/facebook-pixel-robust';

interface ECO4FormData {
  fullName: string;
  address: string;
  postCode: string;
  email: string;
  phone: string;
  understand: boolean;
}

const NativeECO4Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Initialize Facebook Pixel and capture UTM data
  useEffect(() => {
    // Facebook Pixel is already initialized in HTML head for optimal performance
    
    // Capture UTM parameters for later use
    captureUTMData();
  }, []);
  
  const form = useForm<ECO4FormData>({
    defaultValues: {
      fullName: '',
      address: '',
      postCode: '',
      email: '',
      phone: '',
      understand: false
    }
  });

  // Track ViewContent when form loads
  useEffect(() => {
    const timer = setTimeout(() => {
      trackRobustEvent('ViewContent', {
        content_name: 'ECO4 Form Page',
        content_category: 'eco4',
        value: 1,
        currency: 'GBP'
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: ECO4FormData) => {
    console.log('🆘 URGENT DEBUG: Form onSubmit function called!');
    console.log('🆘 URGENT DEBUG: Form data received:', JSON.stringify(data, null, 2));
    // Prevent rapid successive submissions
    const now = Date.now();
    if (isSubmitting) {
      console.warn('Form submission already in progress');
      toast.warning("Please wait, your enquiry is being submitted...");
      return;
    }

    // Prevent submissions within 5 seconds of last attempt
    if (now - lastSubmissionTime < 5000) {
      toast.warning("Please wait a moment before submitting again.");
      return;
    }

    // Limit submission attempts
    if (submitAttempts >= 3) {
      toast.error("Too many submission attempts. Please refresh the page and try again.");
      return;
    }

    console.log('🆘 URGENT DEBUG: About to start form submission process');
    console.log('🚀 ECO4 form submission started:', data);
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    setLastSubmissionTime(now);
    
    console.log('🆘 URGENT DEBUG: About to call submitFormToDatabase');
    
    try {
<<<<<<< HEAD
      // Capture location data for enhanced tracking
=======
      // Capture location data for pixel enhancement
>>>>>>> b98b664298c7eb556958a7dc606cc42d9d3daa2b
      captureLocationData({
        postcode: data.postCode,
        county: data.address.split(',').pop()?.trim()
      });

      // Track InitiateCheckout event with robust tracking
      await trackRobustEvent('InitiateCheckout', {
        content_name: 'ECO4 Form Submission',
        content_category: 'eco4',
        value: 1,
        currency: 'GBP',
        em: data.email,
        ph: data.phone,
        fn: data.fullName.split(' ')[0],
        ln: data.fullName.split(' ').slice(1).join(' ')
      });

      console.log('🆘 URGENT DEBUG: Calling submitFormToDatabase with data:', {
        serviceType: 'eco4',
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postCode,
        address: data.address,
        formName: 'ECO4'
      });
      
      // Save to Supabase database using the enhanced service
      await submitFormToDatabase({
        serviceType: 'eco4',
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postCode,
        address: data.address,
        formData: {
          understand_mains_gas_restriction: data.understand,
          source: 'eco4_new_page'
        },
        formName: 'ECO4'
      });

      // Track successful Lead event with robust dual tracking (Pixel + CAPI)
      await trackRobustEvent('Lead', {
        content_name: 'ECO4 Form Submission',
        content_category: 'eco4',
        value: 1,
        currency: 'GBP',
        em: data.email,
        ph: data.phone,
        fn: data.fullName.split(' ')[0],
        ln: data.fullName.split(' ').slice(1).join(' ')
      });


      console.log('🎉 ECO4 form submission completed successfully');
      
      // Show success message and reset form
      setShowSuccess(true);
      form.reset();
      setSubmitAttempts(0); // Reset attempts on success
      
      // Scroll to top to ensure success message is visible
      setTimeout(() => {
        scrollToTop();
      }, 100);
      
      toast.success("Thank you for your enquiry! We will be in touch within 24 hours to discuss your options.");
      
      // Hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
      
    } catch (error) {
      console.error('💥 ECO4 form submission failed:', error);
      
      // Log failed submission
      console.log('❌ ECO4 form submission failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Duplicate submission')) {
          toast.error("You've already submitted this form recently. Please wait before submitting again.");
        } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
          toast.error("The request timed out. Please check your connection and try again.");
        } else {
          toast.error("Something went wrong. Please try again or call us directly.");
        }
      } else {
        toast.error("Something went wrong. Please try again or call us directly.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card ref={cardRef} className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20 relative z-50">
        <CardContent className="p-6 text-center">
          <div className="text-green-400 mb-4">
            <svg className="w-20 h-20 mx-auto animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
          <p className="text-white/90 text-base leading-relaxed">
            We have received your enquiry and will be in touch within 24 hours to discuss your options.
          </p>
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
            <p className="text-green-300 text-sm font-medium">
              ✓ Your submission has been confirmed
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form 
            ref={formRef}
            onSubmit={(e) => {
              console.log('🆘🆘🆘 FORM HTML SUBMIT EVENT TRIGGERED!');
              console.log('🆘🆘🆘 Form validation state:', form.formState);
              console.log('🆘🆘🆘 Form errors:', form.formState.errors);
              console.log('🆘🆘🆘 Form values:', form.getValues());
              e.preventDefault();
              form.handleSubmit(onSubmit, (errors) => {
                console.log('🆘🆘🆘 FORM VALIDATION FAILED!');
                console.log('🆘🆘🆘 Validation errors:', errors);
              })(e);
            }} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      name="fullName"
                      autoComplete="name"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Address</FormLabel>
                  <FormControl>
                    <Input 
                      name="address"
                      autoComplete="street-address"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="Enter your address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postCode"
              rules={{ required: "Post code is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Post Code</FormLabel>
                  <FormControl>
                    <Input 
                      name="postCode"
                      autoComplete="postal-code"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="G1 1AA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Email</FormLabel>
                  <FormControl>
                    <Input 
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{ 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9\s\-\+\(\)]+$/,
                  message: "Please enter a valid phone number"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Phone</FormLabel>
                  <FormControl>
                    <Input 
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="07xxx xxx xxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <p className="text-white text-sm text-left mb-3 font-bold">
                * Does not apply to Mains Gas properties
              </p>
              
              <FormField
                control={form.control}
                name="understand"
                rules={{ required: "You must confirm you understand" }}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="!h-5 !w-5 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-gray-900 flex-shrink-0 min-h-[20px] min-w-[20px]"
                      />
                    </FormControl>
                    <FormLabel className="text-white text-sm cursor-pointer">
                      I understand
                    </FormLabel>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold h-12 mt-6"
              disabled={isSubmitting || submitAttempts >= 3}
              onClick={(e) => {
                console.log('🆘🆘🆘 SUBMIT BUTTON CLICKED!');
                console.log('🆘🆘🆘 Button disabled?', isSubmitting || submitAttempts >= 3);
                console.log('🆘🆘🆘 isSubmitting:', isSubmitting);
                console.log('🆘🆘🆘 submitAttempts:', submitAttempts);
              }}
            >
              {isSubmitting ? 'Sending...' : submitAttempts >= 3 ? 'Please refresh page' : 'Submit'}
            </Button>
            
            {submitAttempts >= 3 && (
              <p className="text-yellow-300 text-xs text-center mt-2">
                Too many attempts. Please refresh the page to try again.
              </p>
            )}
            
            {isSubmitting && (
              <div className="flex items-center justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="ml-2 text-white text-sm">Submitting your enquiry...</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NativeECO4Form;
