import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitFormToDatabase, trackFormSubmission } from '@/services/formSubmissionService';

interface SolarFormData {
  fullName: string;
  address: string;
  postCode: string;
  email: string;
  phone: string;
  understand: boolean;
}

const NativeSolarForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<SolarFormData>({
    defaultValues: {
      fullName: '',
      address: '',
      postCode: '',
      email: '',
      phone: '',
      understand: false
    }
  });

  const scrollToTop = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
    // Also scroll window to top as fallback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: SolarFormData) => {
    console.log('🚀 Solar form submission started:', data);
    setIsSubmitting(true);
    
    try {
      // Save to Supabase database using the enhanced service
      await submitFormToDatabase({
        serviceType: 'solar',
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postCode,
        address: data.address,
        formData: {
          understand_air_source_heat_pump: data.understand,
          source: 'solar_page'
        }
      });

      // Track the submission
      trackFormSubmission('Solar', 'Solar Panels');

      console.log('🎉 Solar form submission completed successfully');
      
      // Show success message and reset form
      setShowSuccess(true);
      form.reset();
      
      // Scroll to top to ensure success message is visible
      setTimeout(() => {
        scrollToTop();
      }, 100);
      
      toast.success("Thank you for your enquiry! We will be in touch within 24 hours to discuss your options.");
      
      // Hide success message after 8 seconds (longer to ensure user sees it)
      setTimeout(() => {
        setShowSuccess(false);
      }, 8000);
      
    } catch (error) {
      console.error('💥 Solar form submission failed:', error);
      toast.error("Something went wrong. Please try again or call us directly.");
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="fullName"
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="Enter your full name"
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
                      {...field} 
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="Enter your address"
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
                      {...field} 
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="G1 1AA"
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
                      {...field} 
                      type="email"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="your.email@example.com"
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
                      {...field} 
                      type="tel"
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
                      placeholder="07xxx xxx xxx"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <p className="text-white text-sm text-left mb-3">
                * Only for homes with Air Source Heat Pumps
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
                        className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-gray-900"
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
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-12 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NativeSolarForm;
