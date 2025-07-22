import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
    <nav style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '4rem' 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
                alt="Funding For Scotland Logo" 
                style={{ height: '2rem', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none' }} className="lg:block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
                    color: isActive(item.path) ? '#ffffff' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                      e.currentTarget.style.color = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <div style={{
            padding: '0.75rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.75rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  marginBottom: '0.25rem',
                  backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
                  color: isActive(item.path) ? '#ffffff' : '#374151'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.color = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
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

export default Navigation;