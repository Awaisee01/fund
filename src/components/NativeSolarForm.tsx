
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface SolarFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  propertyType: string;
  heatingSystem: string;
}

const NativeSolarForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SolarFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      postcode: '',
      propertyType: '',
      heatingSystem: ''
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
                        placeholder="First name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/90 border-white/30 text-gray-900 text-sm h-9"
                        placeholder="Last name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="postcode"
              rules={{ required: "Postcode is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Postcode</FormLabel>
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
              name="propertyType"
              rules={{ required: "Property type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Property Type</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      className="w-full bg-white/90 border border-white/30 text-gray-900 text-sm h-9 px-3 rounded-md"
                    >
                      <option value="">Select property type</option>
                      <option value="house">House</option>
                      <option value="flat">Flat</option>
                      <option value="bungalow">Bungalow</option>
                      <option value="terraced">Terraced</option>
                      <option value="semi-detached">Semi-detached</option>
                      <option value="detached">Detached</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heatingSystem"
              rules={{ required: "Current heating system is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs">Current Heating System</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      className="w-full bg-white/90 border border-white/30 text-gray-900 text-sm h-9 px-3 rounded-md"
                    >
                      <option value="">Select heating system</option>
                      <option value="air-source-heat-pump">Air Source Heat Pump</option>
                      <option value="electric-boiler">Electric Boiler</option>
                      <option value="electric-heaters">Electric Heaters</option>
                      <option value="lpg">LPG</option>
                      <option value="oil">Oil</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold h-10 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Get My Free Solar Quote'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NativeSolarForm;
