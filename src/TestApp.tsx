console.log('🔧 Loading basic test app...');

const TestApp = () => {
  console.log('🧪 TestApp rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      color: 'black',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1>✅ Test App Working!</h1>
      <p>If you can see this, the basic React app is functioning.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
};

console.log('✅ TestApp component defined');
export default TestApp;