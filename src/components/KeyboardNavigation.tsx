import { useEffect } from 'react';

export function KeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with Alt+M
      if (event.altKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Skip to navigation with Alt+N
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        const navigation = document.querySelector('nav');
        if (navigation) {
          const firstLink = navigation.querySelector('a');
          if (firstLink) {
            firstLink.focus();
          }
        }
      }

      // Enhanced Tab navigation for form elements
      if (event.key === 'Tab') {
        // Add focus ring to current element
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.classList.add('keyboard-focus');
          
          // Remove focus ring after blur
          activeElement.addEventListener('blur', () => {
            activeElement.classList.remove('keyboard-focus');
          }, { once: true });
        }
      }

      // Escape key to close modals/menus
      if (event.key === 'Escape') {
        // Close mobile menu if open
        const mobileMenuButton = document.querySelector('[aria-label="Toggle menu"]') as HTMLButtonElement;
        if (mobileMenuButton && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
          mobileMenuButton.click();
        }

        // Remove focus from current element
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Add skip links to document
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const existingSkipLinks = document.querySelector('.skip-links');
      if (existingSkipLinks) {
        existingSkipLinks.remove();
      }
    };
  }, []);

  return null;
}

export default KeyboardNavigation;