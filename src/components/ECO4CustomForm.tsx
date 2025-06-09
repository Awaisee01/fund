
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ECO4CustomForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-white">
          Enquire Here
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="postCode" className="block text-sm font-medium text-white mb-2">
              Post Code
            </label>
            <input
              type="text"
              id="postCode"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              placeholder="Enter your post code"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 mt-6 border border-white/20"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ECO4CustomForm;
