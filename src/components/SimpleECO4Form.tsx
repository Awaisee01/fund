import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const SimpleECO4Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    postCode: '',
    email: '',
    phone: '',
    understand: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Simple form submitting:', formData);
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
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
      
      // Hide success after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000);
    }, 1000);
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
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-xs block mb-1">Full Name</label>
            <Input 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Address</label>
            <Input 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Post Code</label>
            <Input 
              value={formData.postCode}
              onChange={(e) => setFormData({...formData, postCode: e.target.value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="G1 1AA"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Email</label>
            <Input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Phone</label>
            <Input 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-white/90 border-white/30 text-gray-900 text-sm h-12"
              placeholder="07xxx xxx xxx"
            />
          </div>

          <div className="pt-2">
            <p className="text-white text-sm text-left mb-3 font-bold">
              * Does not apply to Mains Gas properties
            </p>
            
            <div className="flex flex-row items-center space-x-3">
              <Checkbox
                checked={formData.understand}
                onCheckedChange={(checked) => setFormData({...formData, understand: !!checked})}
                className="!h-5 !w-5 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-gray-900"
              />
              <label className="text-white text-sm cursor-pointer">
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
          
          {isSubmitting && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="ml-2 text-white text-sm">Submitting your enquiry...</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleECO4Form;