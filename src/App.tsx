
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import SEOStructuredData from "./components/SEOStructuredData";
import FacebookPixelPageView from "./components/FacebookPixelPageView";
import Home from "./pages/Home";
import ECO4 from "./pages/ECO4";
import ECO4New from "./pages/ECO4New";
import Solar from "./pages/Solar";
import SolarNew from "./pages/SolarNew";
import GasBoilers from "./pages/GasBoilers";
import GasBoilersNew from "./pages/GasBoilersNew";
import HomeImprovements from "./pages/HomeImprovements";
import HomeImprovementsNew from "./pages/HomeImprovementsNew";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <ScrollToTop />
          <SEOStructuredData />
          <FacebookPixelPageView />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
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
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
