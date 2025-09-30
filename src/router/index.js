import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import Settings from '../views/Settings.vue'
import Detections from '../views/Detections.vue'
import Models from '../views/Models.vue'
import DetectionPage from '../views/DetectionPage.vue'  // 确保这行存在

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/detections',
    name: 'Detections',
    component: Detections
  },
  {
    path: '/models',
    name: 'Models',
    component: Models
  },
  {
    path: '/detection',
    name: 'DetectionPage',
    component: DetectionPage  // 检测页面路由
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router