import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Windows mkcert CA location (Chocolatey install)
const caPath = path.join(process.env.LOCALAPPDATA, 'mkcert', 'rootCA.pem')

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.jpg', '**/*.jpeg'],
  server: {
    https: {
      key: fs.readFileSync('../certs/localhost-key.pem'),
      cert: fs.readFileSync('../certs/localhost.pem'),
      ca: fs.readFileSync(caPath),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8000',
        changeOrigin: true,
        secure: true, // must stay true when using mkcert
      }
    }
  }
})
