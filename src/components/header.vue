<template>
  <div class="top-nav">
    <div class="nav-left">
      <div class="toggle-sidebar" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索..." v-model="searchQuery">
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-icon" @click="toggleTheme">
        <i :class="themeIcon"></i>
      </div>
      <div class="nav-icon">
        <i class="far fa-bell"></i>
        <span class="badge">5</span>
      </div>
      <div class="nav-icon">
        <i class="far fa-envelope"></i>
        <span class="badge">3</span>
      </div>
      <div class="user-profile">
        <div class="user-avatar">A</div>
        <span class="user-name">管理员</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'

export default {
  name: 'Header',
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const userStore = useUserStore()
    const searchQuery = ref('')
    
    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }
    
    const toggleTheme = () => {
      userStore.toggleTheme()
    }
    
    const themeIcon = computed(() => 
      userStore.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun'
    )
    
    return {
      searchQuery,
      toggleSidebar,
      toggleTheme,
      themeIcon
    }
  }
}
</script>

<style scoped>
.top-nav {
  background-color: var(--card-bg);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  z-index: 99;
}

.nav-left {
  display: flex;
  align-items: center;
}

.toggle-sidebar {
  font-size: 1.5rem;
  margin-right: 20px;
  cursor: pointer;
  color: var(--text-color);
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 8px 15px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 250px;
  outline: none;
  transition: all 0.3s;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.search-box input:focus {
  border-color: var(--primary);
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-icon {
  font-size: 1.2rem;
  margin-left: 20px;
  cursor: pointer;
  position: relative;
  color: var(--text-color);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 10px;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 15px;
  }
  
  .search-box input {
    width: 150px;
  }
  
  .search-box input:focus {
    width: 180px;
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 576px) {
  .search-box {
    display: none;
  }
}
</style>