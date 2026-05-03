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
  server: {
   proxy: {
      '/api': {
        // 🚩 غير الرقم ده لرقم بورت السيرفر (Backend) بتاعك
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
        // ضيف السطر ده عشان تشيل كلمة /api من الـ URL قبل ما تروح للسيرفر لو السيرفر مش مستنيها
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})
