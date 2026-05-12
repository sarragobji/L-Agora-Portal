import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      // This tells Vite that "@" points to your "src" folder
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})