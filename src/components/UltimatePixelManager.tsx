// Ultimate Pixel Manager - Central command for all tracking
import { useEffect, useState } from 'react';
import { initializeAdvancedTracking } from '@/lib/advanced-pixel-tracking';
import { initializePerformanceOptimizer } from '@/lib/performance-optimizer';

interface PixelManagerProps {
  children: React.ReactNode;
  enableAdvancedFeatures?: boolean;
  performanceMode?: 'high' | 'balanced' | 'minimal';
}

const UltimatePixelManager: React.FC<PixelManagerProps> = ({ 
  children, 
  enableAdvancedFeatures = true,
  performanceMode = 'high'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pixelHealth, setPixelHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        console.log('🚀 ULTIMATE PIXEL MANAGER: Initializing comprehensive tracking system');

        // Initialize performance optimizer first
        const performanceOptimizer = initializePerformanceOptimizer();
        
        // Initialize advanced tracking with appropriate settings
        const trackingOptions = {
          enableServerSide: true,
          enableDeduplication: true,
          enableBehaviorTracking: performanceMode !== 'minimal',
          enablePerformanceTracking: performanceMode === 'high',
          enableErrorTracking: true
        };

        const advancedTracker = initializeAdvancedTracking(trackingOptions);

        // Health check
        setTimeout(() => {
          const health = performanceHealthCheck();
          setPixelHealth(health);
          
          if (health === 'error') {
            console.error('❌ PIXEL HEALTH: Critical issues detected');
          } else if (health === 'warning') {
            console.warn('⚠️ PIXEL HEALTH: Performance issues detected');
          } else {
            console.log('✅ PIXEL HEALTH: All systems operational');
          }
        }, 3000);

        setIsInitialized(true);
        console.log('✅ ULTIMATE PIXEL MANAGER: Initialization complete');

      } catch (error) {
        console.error('❌ ULTIMATE PIXEL MANAGER: Initialization failed', error);
        setPixelHealth('error');
      }
    };

    initializeTracking();
  }, [performanceMode]);

  const performanceHealthCheck = (): 'healthy' | 'warning' | 'error' => {
    try {
      // Check if Facebook Pixel is loaded
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        return 'error';
      }

      // Check for network connectivity
      if (!navigator.onLine) {
        return 'warning';
      }

      // Check Core Web Vitals if available
      if ('performance' in window && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime > 5000) {
          return 'warning';
        }
      }

      return 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return 'error';
    }
  };

  // Visual indicator for development (only in dev mode)
  const PixelHealthIndicator = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    const colors = {
      healthy: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };

    return (
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: colors[pixelHealth],
          zIndex: 9999,
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          opacity: 0.8
        }}
        title={`Pixel Health: ${pixelHealth}`}
      />
    );
  };

  return (
    <>
      {children}
      {isInitialized && enableAdvancedFeatures && <PixelHealthIndicator />}
    </>
  );
};

export default UltimatePixelManager;