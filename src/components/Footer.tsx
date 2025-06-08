
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/2aa49ae8-73b1-423e-a150-6873ec2f9cf6.png" 
                alt="Funding For Scotland Logo" 
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              Scotland's free consultancy for residential grants and funding. We help you access government backed, local authority, and private company schemes for home improvements, energy efficiency upgrades, and renewable energy installations.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Email:</span> info@fundingforscotland.co.uk
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Address:</span> Glasgow, Scotland
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Contact:</span> Use our enquiry form for all enquiries
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/eco4" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">ECO4 Scheme</Link></li>
              <li><Link to="/solar" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Solar Panels</Link></li>
              <li><Link to="/gas-boilers" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Gas Boilers</Link></li>
              <li><Link to="/home-improvements" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Home Improvements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Home</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Funding For Scotland. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm touch-manipulation">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm touch-manipulation">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm touch-manipulation">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
