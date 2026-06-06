import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'

export default defineConfig({
  plugins: [react()],
  base: 'portfolio.github.io', // Must match your GitHub repo name exactly
})
