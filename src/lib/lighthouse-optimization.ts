// Lighthouse Performance Optimization

// 1. Resource Hints Optimization
export const criticalResourceHints = {
  // Only preconnect to domains that will be used immediately
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://connect.facebook.net' // Only if Facebook Pixel is critical
  ],
  
  // Only preload resources that are immediately visible
  preload: {
    fonts: [
      // Only preload the exact font file used for above-the-fold content
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
    ],
    images: [
      // Only preload optimized ECO4 hero image that affects LCP
      '/src/assets/eco4-hero-optimized.webp'
    ]
  }
};

// 2. Font Loading Strategy
export const fontOptimization = {
  // Reduced font weights - only load what's actually used
  weights: [400, 600, 700], // Removed 500 (font-medium) if not critical
  
  // font-display: swap for better performance
  display: 'swap',
  
  // Subset to reduce file size (Latin only for English content)
  subset: 'latin',
  
  // Load strategy
  strategy: 'critical-inline-defer-rest'
};

// 3. Image Optimization
export const imageOptimization = {
  // Critical images for LCP
  critical: [
    '/src/assets/eco4-hero-optimized.webp'
  ],
  
  // Lazy load everything else
  lazyLoad: true,
  
  // Use proper sizing attributes
  dimensions: true,
  
  // Optimize fetch priority
  fetchPriority: {
    hero: 'high',
    aboveFold: 'auto',
    belowFold: 'low'
  }
};

// 4. Manifest Optimization
export const manifestOptimization = {
  // Simplified icon strategy to avoid 404s
  iconStrategy: 'single-scalable',
  
  // Remove unused manifest features
  removeUnused: ['related_applications', 'prefer_related_applications']
};

export default {
  criticalResourceHints,
  fontOptimization,
  imageOptimization,
  manifestOptimization
};