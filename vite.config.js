import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // 1. 修正前端开发服务器端口（确保和你实际启动的端口一致，比如 8080 或 3000）
  server: {
    port: 8080, // 建议明确端口，避免默认端口冲突
    open: true, // 启动后自动打开浏览器
    // 2. 代理配置：将前端请求转发到后端 8000 端口（避免跨域）
    proxy: {
      '/api': { // 所有以 /api 开头的请求都会被代理
        target: 'http://localhost:8000', // 后端服务地址（正确端口）
        changeOrigin: true, // 解决跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api 前缀（如果后端接口没有 /api）
      },
      // 若有其他请求前缀，也按此配置
      '/thumbnails': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 配置 @ 指向 src 目录
    }
  }
})