import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // some deps (and the Emscripten WASM glue) expect a global
    global: 'globalThis',
  },
  optimizeDeps: {
    // let Vite serve the CDR wasm glue as-is instead of pre-bundling it
    exclude: ['@piplabs/cdr-sdk', '@piplabs/cdr-crypto'],
  },
})
