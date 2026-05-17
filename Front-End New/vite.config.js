import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration — BitHub Landing Page
 *
 * Production optimizations:
 * - base: './' ensures all asset paths are relative (works in any subdirectory)
 * - CSS and JS are automatically minified in production builds
 * - Asset inlining for small files (< 4KB) reduces HTTP requests
 * - Source maps disabled in production for smaller bundle size
 */
export default defineConfig({
  plugins: [react()],

  /* Relative base path for flexible deployment */
  base: './',

  build: {
    /* Output to dist/ directory */
    outDir: 'dist',

    /* Inline assets smaller than 4KB */
    assetsInlineLimit: 4096,

    /* Disable source maps in production */
    sourcemap: false,

    /* Rollup options for optimized chunks */
    rollupOptions: {
      output: {
        /* Organize output by type */
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    /* Minification (uses Vite default — oxc in v8+) */

    /* Target modern browsers */
    target: 'es2020',
  },

  server: {
    /* Dev server port */
    port: 3000,
    open: true,
  },
});
