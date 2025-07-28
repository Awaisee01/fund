import { Suspense, lazy } from 'react';

// Optimized lazy loading with proper chunking
const Footer = lazy(() => import('@/components/Footer'));
const ContactForm = lazy(() => import('@/components/ContactForm'));
const ECO4Form = lazy(() => import('@/components/ECO4Form'));
const SolarForm = lazy(() => import('@/components/SolarForm'));
const GasBoilersForm = lazy(() => import('@/components/GasBoilersForm'));
const HomeImprovementsForm = lazy(() => import('@/components/HomeImprovementsForm'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));

// Optimized loading skeletons
const FormSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6 bg-card rounded-lg">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-10 bg-muted rounded"></div>
    <div className="h-10 bg-muted rounded"></div>
    <div className="h-32 bg-muted rounded"></div>
    <div className="h-10 bg-primary/20 rounded w-32"></div>
  </div>
);

const FooterSkeleton = () => (
  <div className="animate-pulse bg-muted h-64 mt-16"></div>
);

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6 p-6">
    <div className="h-8 bg-muted rounded w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-muted rounded"></div>
      ))}
    </div>
    <div className="h-96 bg-muted rounded"></div>
  </div>
);

// Lazy component wrappers with optimized loading
export const LazyFooter = () => (
  <Suspense fallback={<FooterSkeleton />}>
    <Footer />
  </Suspense>
);

export const LazyContactForm = () => (
  <Suspense fallback={<FormSkeleton />}>
    <ContactForm />
  </Suspense>
);

export const LazyECO4Form = () => (
  <Suspense fallback={<FormSkeleton />}>
    <ECO4Form />
  </Suspense>
);

export const LazySolarForm = () => (
  <Suspense fallback={<FormSkeleton />}>
    <SolarForm />
  </Suspense>
);

export const LazyGasBoilersForm = () => (
  <Suspense fallback={<FormSkeleton />}>
    <GasBoilersForm />
  </Suspense>
);

export const LazyHomeImprovementsForm = () => (
  <Suspense fallback={<FormSkeleton />}>
    <HomeImprovementsForm />
  </Suspense>
);

export const LazyAdminDashboard = ({ onLogout }: { onLogout: () => void }) => (
  <Suspense fallback={<DashboardSkeleton />}>
    <AdminDashboard onLogout={onLogout} />
  </Suspense>
);

// Preload function for critical routes
export const preloadRouteComponents = () => {
  // Preload forms based on user behavior patterns
  setTimeout(() => {
    import('@/components/ECO4Form');
  }, 2000);
  
  setTimeout(() => {
    import('@/components/SolarForm');
  }, 3000);
  
  setTimeout(() => {
    import('@/components/Footer');
  }, 1000);
};

export default {
  LazyFooter,
  LazyContactForm,
  LazyECO4Form,
  LazySolarForm,
  LazyGasBoilersForm,
  LazyHomeImprovementsForm,
  LazyAdminDashboard,
  preloadRouteComponents
};