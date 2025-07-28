
const Index = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '2rem',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #3b82f6, #10b981)'
    }}>
      <h1 style={{fontSize: '3rem', fontWeight: '700', color: 'white'}}>
        Funding For Scotland
      </h1>
      <p style={{fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px'}}>
        Free government grants for ECO4, solar panels, gas boilers and home improvements in Scotland.
      </p>
      <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
        <a 
          href="/eco4" 
          style={{
            background: 'white',
            color: '#1f2937',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          ECO4 Grants
        </a>
        <a 
          href="/solar" 
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Solar Panels
        </a>
      </div>
    </div>
  );
};

export default Index;
