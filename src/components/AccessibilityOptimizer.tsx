import { useEffect } from 'react';

export function AccessibilityOptimizer() {
  useEffect(() => {
    // Fix non-descriptive link text
    const fixLinkAccessibility = () => {
      const links = document.querySelectorAll('a');
      
      links.forEach(link => {
        const text = link.textContent?.trim().toLowerCase();
        
        if (text === 'learn more' || text === 'read more' || text === 'click here') {
          const href = link.getAttribute('href');
          
          if (href) {
            let newText = '';
            
            if (href.includes('/eco4')) {
              newText = 'Learn more about ECO4 scheme';
            } else if (href.includes('/solar')) {
              newText = 'Explore solar energy options';
            } else if (href.includes('/gas-boilers')) {
              newText = 'Read more on gas boilers';
            } else if (href.includes('/home-improvements')) {
              newText = 'Home improvement grant details';
            } else if (href.includes('/contact')) {
              newText = 'Contact us for more information';
            }
            
            if (newText) {
              // Preserve existing styling by wrapping in span
              const span = document.createElement('span');
              span.className = link.className;
              span.innerHTML = link.innerHTML.replace(text, newText);
              
              // Add sr-only text for screen readers
              const srText = document.createElement('span');
              srText.className = 'sr-only';
              srText.textContent = ` - ${newText}`;
              
              link.textContent = newText;
              link.setAttribute('aria-label', newText);
            }
          }
        }
        
        // Ensure all links have proper accessibility attributes
        if (!link.getAttribute('aria-label') && !link.textContent?.trim()) {
          const href = link.getAttribute('href');
          if (href) {
            link.setAttribute('aria-label', `Navigate to ${href}`);
          }
        }
      });
    };

    // Add proper image alt text
    const fixImageAccessibility = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          const src = img.src;
          
          if (src.includes('hero')) {
            img.alt = 'Hero banner showcasing energy efficiency services';
          } else if (src.includes('logo')) {
            img.alt = 'Company logo';
          } else if (src.includes('eco4')) {
            img.alt = 'ECO4 energy efficiency scheme illustration';
          } else if (src.includes('solar')) {
            img.alt = 'Solar panel installation example';
          } else if (src.includes('boiler')) {
            img.alt = 'Modern gas boiler installation';
          } else {
            img.alt = 'Service illustration';
          }
        }
      });
    };

    // Add proper heading structure
    const fixHeadingStructure = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headings.forEach(heading => {
        // Ensure headings have proper semantic meaning
        if (!heading.id && heading.textContent) {
          const id = heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          heading.id = id;
        }
      });
    };

    // Run accessibility fixes
    setTimeout(() => {
      fixLinkAccessibility();
      fixImageAccessibility();
      fixHeadingStructure();
    }, 100);

    // Re-run fixes when content changes (for dynamic content)
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        fixLinkAccessibility();
        fixImageAccessibility();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

export default AccessibilityOptimizer;