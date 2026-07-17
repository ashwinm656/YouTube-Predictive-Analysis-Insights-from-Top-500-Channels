import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works whether it's served at the domain
  // root or under a GitHub Pages project subpath (e.g. /repo-name/).
  base: './',
  plugins: [react()],
})
