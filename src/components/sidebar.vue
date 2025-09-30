<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h2><i class="fas fa-camera"></i> <span v-if="!isCollapsed">YOLOv8检测系统</span></h2>
      <p v-if="!isCollapsed">v2.1.0</p>
    </div>
    <div class="sidebar-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.name"
        class="menu-item" 
        :class="{ active: $route.name === item.name }"
        @click="navigateTo(item.path)"
      >
        <i :class="item.icon"></i>
        <span v-if="!isCollapsed">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const isCollapsed = ref(false)
    
    const menuItems = [
      { name: 'Dashboard', title: '控制台', icon: 'fas fa-home', path: '/' },
      { name: 'Detections', title: '检测管理', icon: 'fas fa-camera', path: '/detections' },
      { name: 'Models', title: '模型管理', icon: 'fas fa-cube', path: '/models' },
      { name: 'Users', title: '用户管理', icon: 'fas fa-users', path: '/users' },
      { name: 'Settings', title: '系统设置', icon: 'fas fa-cog', path: '/settings' }
    ]
    
    const navigateTo = (path) => {
      router.push(path)
    }
    
    return {
      isCollapsed,
      menuItems,
      navigateTo
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(to bottom, var(--sidebar-bg), #1a2530);
  color: var(--text-light);
  transition: all 0.3s;
  box-shadow: var(--shadow);
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-header p {
  font-size: 0.8rem;
  opacity: 0.7;
}

.sidebar-menu {
  padding: 15px 0;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 4px solid var(--primary);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.15);
  border-left: 4px solid var(--primary);
}

.menu-item i {
  margin-right: 10px;
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.sidebar.collapsed .menu-item span {
  display: none;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 15px;
}

.sidebar.collapsed .menu-item i {
  margin-right: 0;
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .sidebar-header h2, .menu-item span {
    display: none;
  }
  
  .menu-item {
    justify-content: center;
    padding: 15px;
  }
  
  .menu-item i {
    margin-right: 0;
    font-size: 1.4rem;
  }
}
</style>