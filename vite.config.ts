import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.jsx', '**/*.js', '**/*.tsx', '**/*.ts'],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Prioritize .jsx and .js extensions over TypeScript
    extensions: ['.jsx', '.js', '.ts', '.tsx', '.json'],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
