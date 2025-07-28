import { lazy, Suspense } from 'react';

// Critical path components - load immediately
export const CriticalECO4Hero = lazy(() => import('./CriticalECO4Hero'));
export const SimplifiedHero = lazy(() => import('./SimplifiedHero'));
export const Navigation = lazy(() => import('./Navigation'));

// Standard lazy loading for non-critical components
export const EligibilitySection = lazy(() => import('./EligibilitySection'));
export const ProcessSection = lazy(() => import('./ProcessSection'));
export const CallToActionSection = lazy(() => import('./CallToActionSection'));
export const TrustBadges = lazy(() => import('./TrustBadges'));
export const Footer = lazy(() => import('./Footer'));

// Loading fallbacks
export const ComponentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="py-16 px-4">
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
);

// Enhanced Suspense wrapper
export const OptimizedSuspense = ({ 
  children, 
  fallback = <ComponentSkeleton />
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);