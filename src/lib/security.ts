// Content Security Policy helper
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'", 
    "'unsafe-inline'", // Required for inline scripts in HTML
    "https://connect.facebook.net",
    "https://www.googletagmanager.com"
  ],
  'style-src': [
    "'self'", 
    "'unsafe-inline'", // Required for styled-components and inline styles
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://nncpapnlnrtssbruzkla.supabase.co",
    "https://connect.facebook.net",
    "https://www.facebook.com"
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Generate CSP string
export const generateCSPString = () => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

export default CSP_DIRECTIVES;