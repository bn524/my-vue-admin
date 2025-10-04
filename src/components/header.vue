<template>
  <div class="top-nav">
    <div class="nav-left">
      <div class="toggle-sidebar" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </div>
      <div class="search-container">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="搜索用户..." 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            @input="handleSearchInput"
            ref="searchInput"
          >
          <button class="search-button" @click="handleSearch">
            <span class="search-text">搜索</span>
          </button>
        </div>
        
        <!-- 搜索结果下拉框 -->
        <div v-if="searchResults.length > 0 && showResults" class="search-results">
          <div 
            v-for="user in searchResults" 
            :key="user.id"
            class="search-result-item"
            @click="selectUser(user)"
          >
            <div class="user-avatar-small">{{ user.name.charAt(0) }}</div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </div>
          </div>
          <div class="search-footer" @click="viewAllResults">
            查看全部结果 ({{ searchResults.length }})
          </div>
        </div>
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
      
      <!-- 登录状态显示与登出功能 -->
      <div v-if="authStore.isLoggedIn" class="user-profile-container">
        <div class="user-profile" @click="toggleProfileMenu">
          <div class="user-avatar">{{ authStore.userName.charAt(0) }}</div>
          <span class="user-name">{{ authStore.userName }}</span>
          <i class="fas fa-chevron-down ml-2" :class="{ 'rotate-180': profileMenuOpen }"></i>
        </div>
        
        <!-- 用户菜单（登出按钮） -->
        <div v-if="profileMenuOpen" class="profile-dropdown">
          <div class="dropdown-item" @click="handleLogout">
            <i class="fas fa-sign-out-alt mr-2"></i> 登出
          </div>
        </div>
      </div>
      
      <!-- 未登录时显示登录按钮 -->
      <div v-else class="login-button" @click="goToLogin">
        <i class="fas fa-sign-in-alt mr-1"></i> 登录
      </div>
    </div>

    <!-- 错误提示弹窗 -->
    <div v-if="showError" class="error-toast">
      <div class="error-content">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
        <button class="close-error" @click="showError = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
// 引入登录状态管理
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Header',
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const userStore = useUserStore()
    const authStore = useAuthStore() // 登录状态存储
    const router = useRouter()
    const searchQuery = ref('')
    const showResults = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const searchInput = ref(null)
    // 新增：用户菜单状态
    const profileMenuOpen = ref(false)
    
    // 计算搜索结果的用户列表
    const searchResults = computed(() => {
      if (!searchQuery.value.trim()) {
        return []
      }
      
      const query = searchQuery.value.toLowerCase()
      return userStore.users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    })
    
    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }
    
    const toggleTheme = () => {
      userStore.toggleTheme()
    }
    
    const themeIcon = computed(() => 
      userStore.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun'
    )
    
    // 处理搜索输入
    const handleSearchInput = () => {
      if (searchQuery.value.trim()) {
        showResults.value = true
      } else {
        showResults.value = false
      }
    }
    
    // 显示错误提示
    const showErrorMessage = (message) => {
      errorMessage.value = message
      showError.value = true
      
      // 3秒后自动隐藏
      setTimeout(() => {
        showError.value = false
      }, 3000)
    }
    
    // 处理搜索
    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        showErrorMessage('请输入搜索关键词')
        return
      }
      
      const results = userStore.searchUsers(searchQuery.value)
      if (results.length === 0) {
        showErrorMessage(`没有找到匹配的用户: "${searchQuery.value}"`)
        return
      }
      
      router.push({
        path: '/users',
        query: { search: searchQuery.value }
      })
      showResults.value = false
    }
    
    // 选择用户
    const selectUser = (user) => {
      router.push({
        path: '/users',
        query: { 
          search: searchQuery.value,
          highlight: user.id 
        }
      })
      searchQuery.value = ''
      showResults.value = false
    }
    
    // 查看全部结果
    const viewAllResults = () => {
      const results = userStore.searchUsers(searchQuery.value)
      if (results.length === 0) {
        showErrorMessage(`没有找到匹配的用户: "${searchQuery.value}"`)
        return
      }
      
      router.push({
        path: '/users',
        query: { search: searchQuery.value }
      })
      showResults.value = false
    }
    
    // 点击外部关闭搜索结果
    const closeResults = (event) => {
      if (!event.target.closest('.search-container') && 
          !event.target.closest('.user-profile-container')) {
        showResults.value = false
        profileMenuOpen.value = false
      }
    }
    
    // 新增：用户菜单切换
    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }
    
    // 新增：登出处理
    const handleLogout = () => {
      authStore.logout()
      profileMenuOpen.value = false
      showErrorMessage('已成功登出')
    }
    
    // 新增：跳转到登录页
    const goToLogin = () => {
      router.push('/login')
    }
    
    // 添加全局点击事件监听
    onMounted(() => {
      document.addEventListener('click', closeResults)
      // 初始化登录状态
      authStore.initAuthState()
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', closeResults)
    })
    
    return {
      searchQuery,
      searchResults,
      showResults,
      showError,
      errorMessage,
      searchInput,
      toggleSidebar,
      toggleTheme,
      themeIcon,
      handleSearchInput,
      handleSearch,
      selectUser,
      viewAllResults,
      showErrorMessage,
      authStore,
      profileMenuOpen,
      toggleProfileMenu,
      handleLogout,
      goToLogin
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
  position: relative;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-sidebar {
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

/* 搜索容器样式 */
.search-container {
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
  width: 350px;
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.1);
}

.search-icon {
  padding: 0 12px;
  color: var(--gray);
  font-size: 1rem;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  background: transparent;
  color: var(--text-color);
  font-size: 0.9rem;
}

.search-box input::placeholder {
  color: var(--gray);
}

.search-button {
  background: var(--primary);
  border: none;
  color: white;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-button:hover {
  background: #2a69c4;
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

/* 用户信息与登出菜单样式 */
.user-profile-container {
  position: relative;
  margin-left: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
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

.user-name {
  color: var(--text-color);
  font-weight: 500;
}

/* 登录按钮样式 */
.login-button {
  margin-left: 20px;
  padding: 6px 12px;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #2a69c4;
}

/* 用户下拉菜单 */
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--card-bg);
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 160px;
  margin-top: 5px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 15px;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary);
}

/* 搜索结果样式 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 5px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.search-result-item:last-child {
  border-bottom: none;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  margin-right: 10px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.user-email {
  font-size: 0.8rem;
  color: var(--gray);
}

.search-footer {
  padding: 10px 15px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 500;
}

.search-footer:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 错误提示样式 */
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
  animation: slideIn 0.3s ease-out;
}

.error-content {
  background-color: var(--danger);
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 350px;
}

.close-error {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: auto;
}

/* 辅助样式 */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.mr-1 {
  margin-right: 4px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .top-nav {
    padding: 15px;
  }
  
  .search-box {
    width: 280px;
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 576px) {
  .search-box {
    width: 200px;
  }
  
  .search-button .search-text {
    display: none;
  }
  
  .search-button {
    padding: 10px;
  }
  
  .search-button::after {
    content: "搜";
    font-size: 0.9rem;
  }
}
</style>
