import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // GitHub Pages 需要 repo name 當 base；Vercel 需要 '/'
  base:
    process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
      ? '/my-works-omamori/'
      : '/',
})
