import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Critical above-the-fold components (loaded immediately)
import Navigation from "./components/MobileHamburgerNav";
import ErrorBoundary from "./components/ErrorBoundary";

// Defer non-critical components
const AnalyticsTracker = lazy(() => import("./components/AnalyticsTracker"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const SEOStructuredData = lazy(() => import("./components/SEOStructuredData"));
const FacebookPixelPageView = lazy(() => import("./components/FacebookPixelPageView"));

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
            {/* DIRECT NAVBAR - NO DEPENDENCIES */}
            <div className="min-h-screen flex flex-col">
              <nav style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: '0',
                zIndex: '9999',
                width: '100%',
                minHeight: '64px',
                display: 'block',
                visibility: 'visible',
                opacity: '1'
              }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: '0 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '64px',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="/" style={{ textDecoration: 'none', display: 'block' }}>
                      <img 
                        src="/lovable-uploads/530a44a7-5098-4326-9fc0-fb553bdd9052.png" 
                        alt="Funding For Scotland" 
                        style={{ height: '32px', width: 'auto', display: 'block' }}
                      />
                    </a>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <a href="/" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>Home</a>
                    <a href="/eco4" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>ECO4</a>
                    <a href="/solar" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>Solar</a>
                    <a href="/gas-boilers" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>Gas Boilers</a>
                    <a href="/home-improvements" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>Home Improvements</a>
                    <a href="/contact" style={{ 
                      textDecoration: 'none', 
                      color: '#374151', 
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'block'
                    }}>Contact</a>
                  </div>
                </div>
              </nav>
              
              {/* Defer non-critical tracking components */}
              <Suspense fallback={<ComponentSkeleton />}>
                <AnalyticsTracker />
                <ScrollToTop />
                <SEOStructuredData />
                <FacebookPixelPageView />
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