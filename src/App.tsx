import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Critical above-the-fold components (loaded immediately)
import Navigation from "./components/SimpleNav";
import ErrorBoundary from "./components/ErrorBoundary";

// Defer non-critical components
const AnalyticsTracker = lazy(() => import("./components/AnalyticsTracker"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const StructuredData = lazy(() => import("./components/StructuredData"));
// Removed FacebookPixelPageView - PageView tracking handled in index.html

// Code-split all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const ECO4 = lazy(() => import("./pages/ECO4"));
const Solar = lazy(() => import("./pages/Solar"));
const GasBoilers = lazy(() => import("./pages/GasBoilers"));
const HomeImprovements = lazy(() => import("./pages/HomeImprovements"));
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
            <Navigation />
              
              <div className="min-h-screen flex flex-col">
              <Suspense fallback={<ComponentSkeleton />}>
                <AnalyticsTracker />
                <ScrollToTop />
                <StructuredData />
              </Suspense>
              
              <main className="flex-1">
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/eco4" element={<ECO4 />} />
                    <Route path="/solar" element={<Solar />} />
                    <Route path="/gas-boilers" element={<GasBoilers />} />
                    <Route path="/home-improvements" element={<HomeImprovements />} />
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