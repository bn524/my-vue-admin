// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // 登录状态：isLoggedIn（是否登录）、userName（当前用户名）
  const isLoggedIn = ref(false)
  const userName = ref('')
  
  // 1. 登录方法（静态验证：用户名admin，密码123456）
  const login = (username, password) => {
    // 前端静态验证逻辑
    if (username === 'admin' && password === '123456') {
      isLoggedIn.value = true
      userName.value = username
      // 可选：用localStorage持久化状态（刷新页面不丢失）
      localStorage.setItem('authState', JSON.stringify({
        isLoggedIn: true,
        userName: username
      }))
      return true // 登录成功
    }
    return false // 登录失败
  }
  
  // 2. 登出方法
  const logout = () => {
    isLoggedIn.value = false
    userName.value = ''
    // 清除持久化状态
    localStorage.removeItem('authState')
    // 登出后跳回登录页
    router.push('/login')
  }
  
  // 3. 初始化：页面刷新时从localStorage恢复状态
  const initAuthState = () => {
    const savedState = localStorage.getItem('authState')
    if (savedState) {
      const { isLoggedIn: savedIsLoggedIn, userName: savedUserName } = JSON.parse(savedState)
      isLoggedIn.value = savedIsLoggedIn
      userName.value = savedUserName
    }
  }
  
  return {
    isLoggedIn,
    userName,
    login,
    logout,
    initAuthState
  }
})