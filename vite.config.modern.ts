import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize for modern browsers - no legacy transpilation
      babel: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                esmodules: true, // Target only browsers that support ES modules
                chrome: '91',
                firefox: '90',
                safari: '15',
                edge: '91'
              },
              modules: false,
              useBuiltIns: false, // Don't include polyfills
              bugfixes: true,
              loose: true
            }
          ]
        ],
        // Remove unused transforms for modern browsers
        plugins: [
          // Only include essential plugins
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator'
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022', // Modern browser target
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: false // Don't worry about Safari 10
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize chunk splitting for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
          'utils': ['clsx', 'tailwind-merge'],
          'routing': ['react-router-dom'],
          'forms': ['react-hook-form', '@hookform/resolvers'],
          'supabase': ['@supabase/supabase-js']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable modern CSS features
    cssCodeSplit: true,
    // Optimize CSS
    cssMinify: 'lightningcss'
  },
  // Remove legacy browser support
  legacy: undefined,
  // Optimize dependencies for modern browsers
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      // Exclude polyfills and legacy dependencies
      'es6-promise',
      'whatwg-fetch',
      'core-js'
    ]
  }
});