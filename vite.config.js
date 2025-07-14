import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true, // allows external devices to access it
    port: 5173, // optional: change if needed
  },
})
