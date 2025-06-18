
import { CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FacebookAd = () => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with brand colors */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white p-6">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FS</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Funding For Scotland</h3>
              <p className="text-xs text-blue-100">Sponsored</p>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Could You Be Entitled To FREE Home Improvements?
          </h1>
          
          <p className="text-blue-100 text-sm mb-4">
            Scottish residents may qualify for government grants worth up to £25,000
          </p>
          
          <div className="space-y-2">
            {[
              "✓ FREE Solar Panels",
              "✓ FREE Heating Upgrades", 
              "✓ FREE Insulation",
              "✓ FREE Windows & Doors"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-green-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-6xl mb-2">🏠</div>
            <p className="text-sm font-medium">Your home could qualify for<br />FREE improvements</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.9/5 from 500+ reviews</span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed">
            "The team at Funding For Scotland helped us get completely free solar panels and a new heating system. 
            We're now saving hundreds on our energy bills!" - Sarah M., Edinburgh
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-800 text-sm font-medium">
            ⏰ Limited Time: Government funding is available now but places are limited for 2024
          </p>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 text-base">
          Check Your Eligibility - FREE Assessment
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          No upfront costs • No obligations • 100% free advice
        </p>
      </div>
      
      {/* Social proof footer */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>👍 248 people like this</span>
          <span>💬 52 comments</span>
          <span>↗️ 18 shares</span>
        </div>
      </div>
    </div>
  );
};

export default FacebookAd;
