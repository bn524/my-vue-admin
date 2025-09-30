import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '系统概览' // 添加此meta字段
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '系统设置'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：在每次路由切换后动态修改标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 基于YOLOv8和vue3的目标检测后台管理系统` : '基于YOLOv8和vue3的目标检测后台管理系统'
})

export default router