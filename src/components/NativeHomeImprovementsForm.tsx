import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitFormToDatabase } from '@/services/formSubmissionService';

interface HomeImprovementsFormData {
  fullName: string;
  address: string;
  postCode: string;
  email: string;
  phone: string;
}

const NativeHomeImprovementsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<HomeImprovementsFormData>({
    defaultValues: {
      fullName: '',
      address: '',
      postCode: '',
      email: '',
      phone: ''
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

  const onSubmit = async (data: HomeImprovementsFormData) => {
    console.log('🚀 Home Improvements form submission started:', data);
    setIsSubmitting(true);
    
    try {
      // Save to Supabase database using the enhanced service
      await submitFormToDatabase({
        serviceType: 'home_improvements',
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postCode,
        address: data.address,
        formData: {
          source: 'home_improvements_page'
        },
        formName: 'Home Improvements'
      });

      console.log('🎉 Home Improvements form submission completed successfully');
      
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
      console.error('💥 Home Improvements form submission failed:', error);
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

export default NativeHomeImprovementsForm;
