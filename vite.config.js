import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000, // 设置开发服务器端口:cite[1]:cite[3]
    open: true // 启动后自动打开浏览器:cite[1]:cite[3]
  }
})