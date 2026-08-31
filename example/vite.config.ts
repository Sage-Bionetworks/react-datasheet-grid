import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The app imports the grid from ../../src, which resolves React from the repo
  // root while the app itself resolves it from example/node_modules. Without
  // this, the two copies produce a null hook dispatcher at runtime.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      "react-datasheet-grid"
    ]
  }
})
