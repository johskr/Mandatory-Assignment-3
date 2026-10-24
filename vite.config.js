import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base må matche repo-navnet for at GitHub Pages skal finne filene
export default defineConfig({
  plugins: [react()],
  base: '/Mandatory-Assignment-3/',
})
