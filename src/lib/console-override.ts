// Production console override to remove console.log in production
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  // Keep errors and warnings but remove logs in production
  console.log = () => {};
  
  // Only show critical errors
  console.error = (...args) => {
    if (args[0]?.toString().includes('💥') || args[0]?.toString().includes('Error')) {
      originalConsole.error(...args);
    }
  };
}

export default {};
