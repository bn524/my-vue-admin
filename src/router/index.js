// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// 注意：确保 Pinia 已在 main.js 中安装，否则需先导入 createPinia
import { useAuthStore } from '../stores/auth'

// 修复点1：只保留你实际存在的视图文件路由，删除不存在的文件（如404.vue）
// 修复点2：确保所有 component 导入路径与实际文件一致
const routes = [
  // 登录页（无需登录）
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'), // 确认 Login.vue 存在
    meta: { requireAuth: false }
  },
  // 管理首页（需要登录）
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard.vue'), // 确认 dashboard.vue 存在
    meta: { requireAuth: true }
  },
  // 检测记录页（需要登录）
  {
    path: '/detections',
    name: 'Detections',
    component: () => import('../views/detections.vue'), // 确认 detections.vue 存在
    meta: { requireAuth: true }
  },
  // 模型管理页（需要登录，若不存在可暂时注释）
  {
    path: '/models',
    name: 'Models',
    component: () => import('../views/models.vue'), // 确认 models.vue 存在，不存在则注释
    meta: { requireAuth: true }
  },
  // 设置页（需要登录，若不存在可暂时注释）
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings.vue'), // 确认 settings.vue 存在，不存在则注释
    meta: { requireAuth: true }
  },
  // 用户管理页（新增路由，需要登录）
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'), // 对应你的 Users.vue 组件
    meta: { requireAuth: true }
  },
  // 重定向：默认跳登录页
  {
    path: '/',
    redirect: '/login'
  }
  // 修复点3：删除不存在的 404 路由（若未创建 404.vue）
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/404.vue') // 若没有 404.vue，注释这部分
  // }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置路由守卫（确保 Pinia 已安装）
router.beforeEach((to, from, next) => {
  
  try {
    // 初始化登录状态
    const authStore = useAuthStore()
    authStore.initAuthState()
    
    const needAuth = to.meta.requireAuth
    
    if (needAuth) {
      authStore.isLoggedIn ? next() : next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      if (to.name === 'Login' && authStore.isLoggedIn) {
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } catch (error) {
    // 若 Pinia 未初始化，先跳登录页
    console.error('路由守卫错误:', error)
    next('/login')
  }
})

export default router