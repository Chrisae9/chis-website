import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  },
  server: {
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
