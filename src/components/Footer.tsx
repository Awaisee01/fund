
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
                alt="Funding For Scotland Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Scotland's leading consultancy for homeowner grants and funding. We help you access government and local authority schemes for home improvements, energy efficiency, and renewable energy installations.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold">Phone:</span> 0123 456 7890
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span> info@fundingforscotland.co.uk
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Address:</span> Glasgow, Scotland
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/eco4" className="text-gray-300 hover:text-white transition-colors">ECO4 Grants</Link></li>
              <li><Link to="/solar" className="text-gray-300 hover:text-white transition-colors">Solar Panels</Link></li>
              <li><Link to="/gas-boilers" className="text-gray-300 hover:text-white transition-colors">Gas Boilers</Link></li>
              <li><Link to="/home-improvements" className="text-gray-300 hover:text-white transition-colors">Home Improvements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Funding For Scotland. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
