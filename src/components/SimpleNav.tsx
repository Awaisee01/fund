import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SimpleNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const location = useLocation();

  // Simple mobile detection that works immediately
  useEffect(() => {
    const checkIfMobile = () => {
      setShowMobile(window.innerWidth < 768);
    };
    
    // Check immediately
    checkIfMobile();
    
    // Check on resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'ECO4', path: '/eco4' },
    { name: 'Solar', path: '/solar' },
    { name: 'Gas Boilers', path: '/gas-boilers' },
    { name: 'Home Improvements', path: '/home-improvements' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    const active = location.pathname === path;
    console.log(`Checking ${path} against ${location.pathname}: ${active}`);
    return active;
  };

  return (
    <nav 
      className="bg-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Always Visible */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-all duration-200">
            <img 
              src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
              alt="Funding For Scotland - Government grants for energy efficiency"
              width="180"
              height="48"
              className="h-10 sm:h-12 lg:h-12 w-auto max-w-[180px] object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </Link>

        {/* DESKTOP MENU - Only show if NOT mobile */}
        {!showMobile && (
          <div className="hidden lg:block ml-10">
            <div className="flex items-baseline space-x-2 xl:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-2 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE HAMBURGER - Only show if mobile */}
        {showMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
            </div>
          </button>
        )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU - Only show if mobile AND open */}
      {showMobile && isOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden border-t bg-white shadow-lg"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${index !== navItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                role="menuitem"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SimpleNav;