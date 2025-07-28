import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'ECO4', path: '/eco4' },
    { name: 'Solar', path: '/solar' },
    { name: 'Gas Boilers', path: '/gas-boilers' },
    { name: 'Home Improvements', path: '/home-improvements' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '4rem' 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              aria-label="Funding For Scotland - Home"
            >
              <img 
                src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
                alt="Funding For Scotland Logo" 
                style={{ height: '2rem', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation - ONLY SHOW ON DESKTOP */}
          <div style={{ 
            display: window.innerWidth >= 768 ? 'flex' : 'none',
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
                  color: isActive(item.path) ? '#ffffff' : '#374151'
                }}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger menu - ONLY SHOW ON MOBILE */}
          <div style={{ 
            display: window.innerWidth < 768 ? 'block' : 'none'
          }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                color: '#374151',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div 
            style={{
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              paddingTop: '0.5rem',
              paddingBottom: '0.75rem'
            }}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div style={{ padding: '0 0.5rem' }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    marginBottom: '0.25rem',
                    transition: 'all 0.2s',
                    backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
                    color: isActive(item.path) ? '#ffffff' : '#374151'
                  }}
                  role="menuitem"
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;