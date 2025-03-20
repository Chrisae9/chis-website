import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import { getSitemapEntries } from './src/utils/sitemapConfig'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      dynamicRoutes: getSitemapEntries(),
      hostname: 'https://chis.dev',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
      outDir: 'dist'
    }),
  ],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
