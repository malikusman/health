import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Optional same-origin proxy when VITE_HEALTH_API_BASE_URL is empty
      '/api': {
        target: 'https://health-api.dev-scorpiusnetworks.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
