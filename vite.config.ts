/**
 * Vite configuration file
 * 
 * This file configures the Vite build process, development server,
 * and plugin settings for the blog application.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { getSitemapEntries } from './src/utils/sitemapConfig'
import { SITE_URL } from './src/config/constants/site'

export default defineConfig({
  /**
   * Configured plugins for enhanced functionality
   */
  plugins: [
    // React plugin for JSX support
    react(),
    
    // Tailwind CSS plugin for styling
    tailwindcss(),
    
    // Sitemap generator for SEO
    sitemap({
      dynamicRoutes: getSitemapEntries(),
      hostname: SITE_URL,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
      outDir: 'dist'
    }),
  ],
  
  /**
   * Specify which file types should be treated as assets
   */
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  
  /**
   * Base URL for the application (used for deployed assets)
   */
  base: '/',
  
  /**
   * Path aliases for simpler imports
   */
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  },
  
  /**
   * Development server configuration
   */
  server: {
    port: 5173,
    host: true
  },
  
  /**
   * Preview server configuration (for testing production builds)
   */
  preview: {
    port: 5173,
    host: true
  },
  
  /**
   * Build output configuration
   */
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
