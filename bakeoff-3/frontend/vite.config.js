import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Vite configuration setup
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
})