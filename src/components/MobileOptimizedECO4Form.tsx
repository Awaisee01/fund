import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitFormToDatabase } from '@/services/formSubmissionService';

interface ECO4FormData {
  fullName: string;
  address: string;
  postCode: string;
  email: string;
  phone: string;
  understand: boolean;
}

const MobileOptimizedECO4Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ECO4FormData>({
    defaultValues: {
      fullName: '',
      address: '',
      postCode: '',
      email: '',
      phone: '',
      understand: false,
    },
  });

  const onSubmit = async (data: ECO4FormData) => {
    // Rate limiting
    const now = Date.now();
    if (now - lastSubmissionTime < 5000) { // 5 second cooldown
      toast.error("Please wait before submitting again");
      return;
    }

    if (submitAttempts >= 3) {
      toast.error("Maximum submission attempts reached. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    setLastSubmissionTime(now);

    try {
      // Enhanced form data with source tracking - matching service interface
      const enhancedData = {
        serviceType: 'eco4' as const,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        postCode: data.postCode,
        currentHeatingSystem: 'unknown', // ECO4 doesn't ask this specifically
        propertyType: 'unknown', // ECO4 doesn't ask this specifically
        understand: data.understand,
        source: 'ECO4 Page',
        formType: 'ECO4 Assessment',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        utmSource: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
        referrer: document.referrer || 'direct'
      };

      const result = await submitFormToDatabase(enhancedData);
      
      if (result.success) {
        setShowSuccess(true);
        // Scroll to top of card to show success message
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        toast.success("Thank you! Your enquiry has been submitted successfully.", {
          duration: 5000,
        });

        // Reset form
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("There was an error submitting your form. Please try again or call us directly.", {
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (showSuccess) {
    return (
      <Card ref={cardRef} className="w-full max-w-md mx-auto bg-green-50 border-green-200 shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700 mb-4">
            Your ECO4 assessment request has been received. Our team will contact you within 24 hours to discuss your eligibility.
          </p>
          <Button 
            onClick={() => setShowSuccess(false)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Submit Another Enquiry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-lg shadow-xl border-0 transform transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Get Your Free ECO4 Assessment
        </CardTitle>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Complete this form to check your eligibility for free energy efficiency improvements worth up to £25,000.
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field - Mobile Optimized */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 touch-manipulation"
                      autoComplete="name"
                      inputMode="text"
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Address Field - Mobile Optimized */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Property Address *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your property address"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 touch-manipulation"
                      autoComplete="address-line1"
                      inputMode="text"
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Post Code Field - Mobile Optimized */}
            <FormField
              control={form.control}
              name="postCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Post Code *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your post code"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 uppercase touch-manipulation"
                      autoComplete="postal-code"
                      inputMode="text"
                      style={{ textTransform: 'uppercase' }}
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Email Field - Mobile Optimized */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 touch-manipulation"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Phone Field - Mobile Optimized */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter your phone number"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 touch-manipulation"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Understanding Checkbox - Mobile Optimized */}
            <FormField
              control={form.control}
              name="understand"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 bg-blue-50/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 h-5 w-5 border-2 border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 touch-manipulation"
                      required
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-800 cursor-pointer touch-manipulation">
                      I understand this is a government-backed scheme *
                    </FormLabel>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By ticking this box, you confirm that you understand the ECO4 scheme is funded by the government and energy suppliers to help eligible households improve their home's energy efficiency at no cost.
                    </p>
                  </div>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button - Mobile Optimized */}
            <Button 
              type="submit" 
              disabled={isSubmitting || submitAttempts >= 3}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Get My Free Assessment"
              )}
            </Button>

            {/* Error States */}
            {submitAttempts >= 3 && (
              <p className="text-red-600 text-sm text-center mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                Maximum attempts reached. Please refresh the page to try again.
              </p>
            )}
            
            {/* Help Text */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By submitting this form, you consent to being contacted about ECO4 services. 
              Your data is processed in accordance with our privacy policy.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedECO4Form;