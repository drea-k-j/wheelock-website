import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const certDir = path.resolve(__dirname, '../certs')
const keyPath = path.join(certDir, 'localhost-key.pem')
const certPath = path.join(certDir, 'localhost.pem')
const caPath = process.platform === 'win32'
  ? path.join(process.env.LOCALAPPDATA || '', 'mkcert', 'rootCA.pem')
  : process.platform === 'darwin'
    ? path.join(os.homedir(), 'Library', 'Application Support', 'mkcert', 'rootCA.pem')
    : path.join(os.homedir(), '.local', 'share', 'mkcert', 'rootCA.pem')

// Check if cert files exist
const certsExist = fs.existsSync(keyPath) && fs.existsSync(certPath) && fs.existsSync(caPath)

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.jpg', '**/*.jpeg'],
  server: {
    https: false,
    proxy: {
      '/api': {
        target: certsExist ? 'https://localhost:8000' : 'http://localhost:8000',
        changeOrigin: true,
        secure: certsExist,
      }
    }
  }
})
