import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactForm = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div>
        <Label htmlFor="fullName" className="text-white text-xs font-medium">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-8 text-sm"
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-white text-xs font-medium">
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-8 text-sm"
          placeholder="Enter your phone number"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-white text-xs font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-8 text-sm"
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-white text-xs font-medium">
          Address
        </Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-8 text-sm"
          placeholder="Enter your address"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="postCode" className="text-white text-xs font-medium">
          Post Code
        </Label>
        <Input
          id="postCode"
          name="postCode"
          type="text"
          value={formData.postCode}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40 h-8 text-sm"
          placeholder="Enter your post code"
          required
        />
      </div>
      
      <div className="pt-7">
        <Button
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 border h-8 text-sm"
          variant="outline"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
