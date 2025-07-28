const Solar = () => {
  return (
    <div style={{minHeight: '100vh', padding: '2rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
        <h1 style={{fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem'}}>
          Free Solar Panels Scotland
        </h1>
        <p style={{fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem'}}>
          Get free solar panels through government schemes with no upfront costs.
        </p>
        <div style={{
          background: 'rgba(59,130,246,0.1)',
          padding: '2rem',
          borderRadius: '0.5rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>
            Check Your Eligibility
          </h3>
          <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <input type="text" placeholder="Full Name" style={{padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}} />
            <input type="email" placeholder="Email" style={{padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}} />
            <input type="tel" placeholder="Phone" style={{padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db'}} />
            <button type="submit" style={{background: '#3b82f6', color: 'white', padding: '0.75rem', borderRadius: '0.25rem', border: 'none', fontWeight: '600'}}>
              Get Free Assessment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Solar;