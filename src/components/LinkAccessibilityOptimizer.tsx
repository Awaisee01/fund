import { useEffect } from 'react';

const LinkAccessibilityOptimizer = () => {
  useEffect(() => {
    const optimizeLinkText = () => {
      // Map of routes to descriptive link text
      const linkTextMap: Record<string, string> = {
        '/eco4': 'Learn more about ECO4 energy efficiency scheme',
        '/solar': 'Explore solar panel installation options',
        '/gas-boilers': 'Read more about gas boiler upgrades',
        '/home-improvements': 'Discover home improvement grant details',
        '/contact': 'Contact us for a free consultation'
      };

      // Find and update non-descriptive links
      const updateLinks = () => {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach((link: Element) => {
          const linkElement = link as HTMLAnchorElement;
          const href = linkElement.getAttribute('href');
          const currentText = linkElement.textContent?.trim().toLowerCase();
          
          // Check if link has non-descriptive text
          const nonDescriptiveTexts = [
            'learn more',
            'read more', 
            'click here',
            'more info',
            'details',
            'find out more'
          ];
          
          if (href && currentText && nonDescriptiveTexts.includes(currentText)) {
            const descriptiveText = linkTextMap[href];
            
            if (descriptiveText) {
              // Update link text
              linkElement.textContent = descriptiveText;
              
              // Add aria-label for screen readers
              linkElement.setAttribute('aria-label', descriptiveText);
              
              // Add title for additional context
              linkElement.setAttribute('title', descriptiveText);
              
              console.log(`✅ Updated link text: "${currentText}" → "${descriptiveText}"`);
            }
          }
          
          // Ensure all links have proper accessibility attributes
          if (href && !linkElement.getAttribute('aria-label')) {
            const text = linkElement.textContent?.trim();
            if (text) {
              linkElement.setAttribute('aria-label', text);
            }
          }
          
          // Add external link indicators
          if (href?.startsWith('http') && !href.includes(window.location.hostname)) {
            linkElement.setAttribute('rel', 'noopener noreferrer');
            linkElement.setAttribute('target', '_blank');
            
            // Add visual indicator for external links
            if (!linkElement.querySelector('.external-link-icon')) {
              const icon = document.createElement('span');
              icon.className = 'external-link-icon';
              icon.setAttribute('aria-hidden', 'true');
              icon.innerHTML = ' ↗';
              linkElement.appendChild(icon);
            }
          }
        });
      };

      // Update button texts that act as links
      const updateButtonLinks = () => {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach((button: Element) => {
          const buttonElement = button as HTMLButtonElement;
          const text = buttonElement.textContent?.trim().toLowerCase();
          
          if (text === 'learn more' || text === 'get started') {
            // Find the parent or nearby link to determine context
            const parentLink = buttonElement.closest('a');
            const nearbyLink = buttonElement.parentElement?.querySelector('a[href]');
            
            const contextLink = parentLink || nearbyLink;
            if (contextLink) {
              const href = contextLink.getAttribute('href');
              const descriptiveText = href ? linkTextMap[href] : null;
              
              if (descriptiveText) {
                buttonElement.textContent = descriptiveText;
                buttonElement.setAttribute('aria-label', descriptiveText);
                console.log(`✅ Updated button text: "${text}" → "${descriptiveText}"`);
              }
            }
          }
        });
      };

      updateLinks();
      updateButtonLinks();
    };

    // Run optimization immediately
    optimizeLinkText();

    // Also run after dynamic content loads
    const observer = new MutationObserver((mutations) => {
      let hasNewLinks = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'A' || element.querySelector('a') || 
                element.tagName === 'BUTTON' || element.querySelector('button')) {
              hasNewLinks = true;
            }
          }
        });
      });
      
      if (hasNewLinks) {
        requestIdleCallback(optimizeLinkText);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

export default LinkAccessibilityOptimizer;