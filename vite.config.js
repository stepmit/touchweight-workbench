import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative asset paths — works whether deployed at a domain root or a subpath
  plugins: [react()],
})
