import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Critical components only
import Navigation from "./components/SimpleNav";

// Only load the current page to minimize JS bundle
import ECO4 from "./pages/ECO4";

// Minimal lazy loading for essential pages only
const Index = lazy(() => import("./pages/Index"));
const Solar = lazy(() => import("./pages/Solar"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Remove QueryClient entirely for mobile performance

// Minimal loading fallback
const Loader = () => <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>;

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<Loader />}>
            <Index />
          </Suspense>
        } />
        <Route path="/eco4" element={<ECO4 />} />
        <Route path="/solar" element={
          <Suspense fallback={<Loader />}>
            <Solar />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;