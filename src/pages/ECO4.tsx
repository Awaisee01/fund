import { Suspense, lazy } from 'react';

// Critical above-the-fold components loaded immediately
import CriticalECO4Hero from '@/components/CriticalECO4Hero';
import { useECO4Page } from '@/hooks/useECO4Page';
import { EligibilityRequirementsSection, ProcessInstallationSection } from '@/components/ECO4PageStructure';

// Defer resource prefetcher until after critical rendering
const ResourcePrefetcher = lazy(() => import('@/components/ResourcePrefetcher'));

const ECO4 = () => {
  const { scrollY, criticalLoaded, nonCriticalReady, userBehavior } = useECO4Page();

  // Critical loading skeleton with immediate render
  if (!criticalLoaded) {
    return (
      <div className="min-h-screen" style={{background:'linear-gradient(45deg,rgba(37,99,235,0.8),rgba(22,163,74,0.8))'}}>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="animate-pulse space-y-4">
                <div style={{height:'4rem',background:'rgba(255,255,255,0.2)',borderRadius:'0.5rem',width:'75%',marginBottom:'1rem'}}></div>
                <div style={{height:'2rem',background:'rgba(255,255,255,0.15)',borderRadius:'0.5rem',width:'50%',marginBottom:'1rem'}}></div>
                <div style={{height:'1.5rem',background:'rgba(255,255,255,0.1)',borderRadius:'0.5rem',width:'80%'}}></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div style={{height:'24rem',background:'rgba(255,255,255,0.1)',borderRadius:'0.5rem'}} className="animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Critical above-the-fold content - loads immediately */}
      <CriticalECO4Hero scrollY={scrollY} />
      
      {/* Non-critical resource prefetcher - deferred */}
      {nonCriticalReady && (
        <Suspense fallback={null}>
          <ResourcePrefetcher currentPage="eco4" userBehavior={userBehavior} />
        </Suspense>
      )}
      
      {/* Below-the-fold content - lazy loaded */}
      {nonCriticalReady && (
        <>
          <EligibilityRequirementsSection />
          <ProcessInstallationSection />
        </>
      )}
    </div>
  );
};

export default ECO4;