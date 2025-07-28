// Script Loading Optimization Utilities

export interface ScriptConfig {
  src: string;
  async?: boolean;
  defer?: boolean;
  crossorigin?: string;
  integrity?: string;
  loading?: 'eager' | 'lazy';
}

export class ScriptLoader {
  private static loadedScripts = new Set<string>();
  private static loadingScripts = new Map<string, Promise<void>>();

  static async loadScript(config: ScriptConfig): Promise<void> {
    const { src } = config;

    // Return early if already loaded
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    // Return existing promise if already loading
    if (this.loadingScripts.has(src)) {
      return this.loadingScripts.get(src)!;
    }

    // Create new loading promise
    const loadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      
      // Set all attributes
      script.src = src;
      if (config.async) script.async = true;
      if (config.defer) script.defer = true;
      if (config.crossorigin) script.crossOrigin = config.crossorigin;
      if (config.integrity) script.integrity = config.integrity;

      script.onload = () => {
        this.loadedScripts.add(src);
        this.loadingScripts.delete(src);
        resolve();
      };

      script.onerror = () => {
        this.loadingScripts.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });

    this.loadingScripts.set(src, loadPromise);
    return loadPromise;
  }

  // Load scripts with priority order
  static async loadScriptsInSequence(scripts: ScriptConfig[]): Promise<void> {
    for (const script of scripts) {
      await this.loadScript(script);
    }
  }

  // Load scripts in parallel
  static async loadScriptsInParallel(scripts: ScriptConfig[]): Promise<void> {
    const promises = scripts.map(script => this.loadScript(script));
    await Promise.all(promises);
  }
}

// Predefined script configurations
export const scriptConfigs = {
  // Critical scripts (load immediately)
  critical: [
    {
      src: '/assets/react-core.js',
      async: false,
      defer: false
    },
    {
      src: '/assets/index.js',
      async: false,
      defer: false
    }
  ],

  // Non-critical scripts (load after LCP)
  nonCritical: [
    {
      src: '/assets/supabase.js',
      async: true,
      defer: true
    },
    {
      src: '/assets/ui-components.js',
      async: true,
      defer: true
    }
  ],

  // Third-party scripts (load last)
  thirdParty: [
    {
      src: 'https://connect.facebook.net/en_US/fbevents.js',
      async: true,
      defer: true
    },
    {
      src: 'https://cdn.gpteng.co/lovable.js',
      async: true,
      defer: true
    }
  ]
};

// Performance monitoring
export const measureScriptPerformance = (scriptName: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) {
        console.warn(`Script ${scriptName} took ${duration.toFixed(2)}ms to load`);
      }
      
      // Mark for performance tracking
      performance.mark(`script-${scriptName}-loaded`);
      
      return duration;
    }
  };
};