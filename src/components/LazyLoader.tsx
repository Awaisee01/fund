import React, { Suspense, lazy } from 'react';

// Lazy load non-critical components for better performance
const AdminDashboard = lazy(() => import('../pages/Admin'));
const Contact = lazy(() => import('../pages/Contact'));
const GasBoilers = lazy(() => import('../pages/GasBoilers'));
const Solar = lazy(() => import('../pages/Solar'));
const HomeImprovements = lazy(() => import('../pages/HomeImprovements'));

// Note: UI components removed from lazy loading to avoid TypeScript issues

export function LazyLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

// Export lazy components for better bundle splitting
export { AdminDashboard, Contact, GasBoilers, Solar, HomeImprovements };

export default LazyLoader;