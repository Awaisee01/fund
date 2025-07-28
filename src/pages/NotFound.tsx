const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{fontSize: '3rem', fontWeight: '700', color: '#1f2937'}}>404</h1>
      <p style={{fontSize: '1.125rem', color: '#6b7280'}}>Page not found</p>
      <a 
        href="/" 
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;