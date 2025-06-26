import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import ECO4 from '@/pages/ECO4';
import Solar from '@/pages/Solar';
import GasBoilers from '@/pages/GasBoilers';
import HomeImprovements from '@/pages/HomeImprovements';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { useState, useEffect } from 'react';
import { usePageTracking } from '@/hooks/usePageTracking';

function App() {
  // Add page tracking
  usePageTracking();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuthenticated');
    if (storedAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('adminAuthenticated', 'true');
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/eco4" element={<ECO4 />} />
        <Route path="/solar" element={<Solar />} />
        <Route path="/gas-boilers" element={<GasBoilers />} />
        <Route path="/home-improvements" element={<HomeImprovements />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/admin/dashboard"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
