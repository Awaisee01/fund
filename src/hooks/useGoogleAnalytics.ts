import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}
export function useGoogleAnalytics(trackingId: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return; // 🚫 Skip on server

    // Load GA script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.async = true;
    document.head.appendChild(script);

    // Setup GA
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', trackingId);
  }, [trackingId]);
}
