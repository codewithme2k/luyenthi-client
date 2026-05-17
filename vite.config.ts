import { defineConfig } from 'vite'
import path from 'path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 500, // Tăng giới hạn cảnh báo lên 1000kB (1MB)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Tách riêng nhóm thư viện React cốt lõi
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            // Tách riêng thư viện Icon khổng lồ
            if (id.includes('lucide')) {
              return 'vendor-lucide'
            }
            // Tách riêng nhóm thư viện giao diện Radix UI / Shadcn
            if (id.includes('@radix-ui')) {
              return 'vendor-radix'
            }
            // Tất cả các thư viện còn lại vào chung 1 nhóm
            return 'vendor'
          }
        }
      }
    }
  }
})
