import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { submitFormToDatabase } from '@/services/formSubmissionService';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Contact form submission started:', formData);
    setIsSubmitting(true);
    
    try {
      // Save to Supabase database using the enhanced service
      await submitFormToDatabase({
        serviceType: 'eco4', // Contact form can be general, but using eco4 as default
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        postcode: formData.postCode,
        address: formData.address,
        formData: {
          source: 'contact_form'
        },
        formName: 'Contact'
      });

      console.log('🎉 Contact form submission completed successfully');
      
      // Show success message and reset form
      setShowSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        postCode: ''
      });
      
      toast.success("Thank you for your enquiry! We will be in touch within 24 hours to discuss your options.");
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('💥 Contact form submission failed:', error);
      toast.error("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6 text-center">
          <div className="text-green-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
          <p className="text-white/90 text-sm">
            We will be in touch within 24 hours to discuss your options.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 pb-4">
      <div>
        <Label htmlFor="fullName" className="text-white text-sm sm:text-xs font-medium">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-10 sm:h-8 text-base sm:text-sm touch-manipulation"
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-white text-sm sm:text-xs font-medium">
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-10 sm:h-8 text-base sm:text-sm touch-manipulation"
          placeholder="Enter your phone number"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-white text-sm sm:text-xs font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-10 sm:h-8 text-base sm:text-sm touch-manipulation"
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-white text-sm sm:text-xs font-medium">
          Address
        </Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-10 sm:h-8 text-base sm:text-sm touch-manipulation"
          placeholder="Enter your address"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="postCode" className="text-white text-sm sm:text-xs font-medium">
          Post Code
        </Label>
        <Input
          id="postCode"
          name="postCode"
          type="text"
          value={formData.postCode}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-10 sm:h-8 text-base sm:text-sm touch-manipulation"
          placeholder="Enter your post code"
          required
        />
      </div>
      
      <div className="pt-6 sm:pt-7">
        <Button
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 border h-12 sm:h-8 text-base sm:text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-[1.02] touch-manipulation"
          variant="outline"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
