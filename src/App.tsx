import { BrowserRouter, Routes, Route } from "react-router-dom";

const SimpleIndex = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2563eb, #059669)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Unlock Scottish Grants & Funding
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        From heating upgrades, to free solar panels, to improving the look of Scotland homes. 
        Funding for Scotland are here to help people in Scotland unlock the funding and grant schemes they are entitled to
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
          ✅ Free Solar Panels
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
          ✅ Free Heating Upgrades
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
          ✅ Free Insulation
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
          ✅ Free Gas Boilers
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
          ✅ Grants for Home Improvements
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<SimpleIndex />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;