// Ultra-lightweight Facebook Pixel tracking for 100% Lighthouse performance

// Track events with minimal performance impact
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  // Only track critical conversion events to reduce network requests
  const criticalEvents = ['Lead', 'Contact', 'CompleteRegistration', 'Purchase'];
  if (!criticalEvents.includes(eventName)) return;

  // Use requestIdleCallback to defer tracking and avoid blocking main thread
  const track = () => {
    try {
      if ((window as any).fbq) {
        (window as any).fbq('track', eventName, parameters);
      }
    } catch (error) {
      // Silent fail to avoid console pollution
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(track, { timeout: 3000 });
  } else {
    setTimeout(track, 1500);
  }
};

export default { trackEvent };