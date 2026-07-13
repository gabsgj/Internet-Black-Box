import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'patch-graphology',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('graphology') && code.includes('import(data, merge = false)')) {
          return code.replace(/import\s*\(\s*data\s*,\s*merge\s*=\s*false\s*\)/g, '"import"(data, merge = false)');
        }
      }
    }
  ],
})
