import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom', // simulate browser
    globals: true, // allows describe(), it(), expect() globally
    setupFiles: './src/setupTest.ts',
  },
})
