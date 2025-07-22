import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Critical above-the-fold components (loaded immediately)
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";

// Defer non-critical components
const AnalyticsTracker = lazy(() => import("./components/AnalyticsTracker"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const SEOStructuredData = lazy(() => import("./components/SEOStructuredData"));
const FacebookPixelPageView = lazy(() => import("./components/FacebookPixelPageView"));
const PerformanceMonitor = lazy(() => import("./components/PerformanceMonitor"));

// Code-split all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ECO4 = lazy(() => import("./pages/ECO4"));
const ECO4New = lazy(() => import("./pages/ECO4New"));
const Solar = lazy(() => import("./pages/Solar"));
const SolarNew = lazy(() => import("./pages/SolarNew"));
const GasBoilers = lazy(() => import("./pages/GasBoilers"));
const GasBoilersNew = lazy(() => import("./pages/GasBoilersNew"));
const HomeImprovements = lazy(() => import("./pages/HomeImprovements"));
const HomeImprovementsNew = lazy(() => import("./pages/HomeImprovementsNew"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Page loading skeleton
const PageLoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
    </div>
  </div>
);

// Component loading skeleton  
const ComponentSkeleton = () => (
  <div className="h-16 bg-gray-100 animate-pulse"></div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            {/* Critical above-the-fold content loads immediately */}
            <div className="min-h-screen flex flex-col">
              <Navigation />
              
              {/* Analytics re-enabled with performance fixes applied */}
              <Suspense fallback={<ComponentSkeleton />}>
                <AnalyticsTracker />
                <ScrollToTop />
                <SEOStructuredData />
                <FacebookPixelPageView />
                <PerformanceMonitor />
              </Suspense>
              
              <main className="flex-1">
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/eco4" element={<ECO4 />} />
                    <Route path="/eco4-new" element={<ECO4New />} />
                    <Route path="/solar" element={<Solar />} />
                    <Route path="/solar-new" element={<SolarNew />} />
                    <Route path="/gas-boilers" element={<GasBoilers />} />
                    <Route path="/gas-boilers-new" element={<GasBoilersNew />} />
                    <Route path="/home-improvements" element={<HomeImprovements />} />
                    <Route path="/home-improvements-new" element={<HomeImprovementsNew />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              {/* Defer footer loading */}
              <Suspense fallback={<div className="h-32 bg-gray-100"></div>}>
                <Footer />
              </Suspense>
            </div>
            
            <Toaster position="top-center" />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;