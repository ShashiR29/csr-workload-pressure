import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base is the repo name for production (GitHub Pages project site); root for local dev.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/csr-workload-pressure/' : '/',
}))
