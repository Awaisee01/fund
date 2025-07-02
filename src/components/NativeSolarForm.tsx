
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
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

  const onSubmit = async (data: SolarFormData) => {
    setIsSubmitting(true);
    
    try {
      // Trigger Meta Pixel event for actual form submission
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Solar Form Submission',
          content_category: 'Solar Panels',
          value: 1,
          currency: 'GBP'
        });
      }
      
      // Also trigger Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submit', {
          form_name: 'solar_enquiry_form',
          form_location: 'solar_new_page'
        });
      }

      // Here you would normally send to your backend
      console.log('Solar form submitted:', data);
      
      toast({
        title: "Thank you for your enquiry!",
        description: "We'll be in touch within 24 hours to discuss your solar options.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
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
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
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
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
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
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
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
                      className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
                      placeholder="07xxx xxx xxx"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <p className="text-white text-sm text-center mb-3">
                Only for homes with Air Source Heat Pumps
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
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-10 mt-6"
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
