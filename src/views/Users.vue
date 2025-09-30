<template>
  <div class="users">
    <div class="page-header">
      <div class="page-title">
        <h1>用户管理</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>用户管理</span>
          <span v-if="searchKeyword" class="search-indicator">
            - 搜索: "{{ searchKeyword }}"
            <button class="clear-search" @click="clearSearch">清除</button>
          </span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <i class="fas fa-plus"></i> 添加用户
        </button>
      </div>
    </div>

    <!-- 搜索框区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="输入用户名、邮箱或角色进行搜索..." 
            v-model="localSearchQuery"
            @keyup.enter="handleLocalSearch"
          >
          <button class="search-button" @click="handleLocalSearch">
            <span class="search-text">搜索</span>
          </button>
        </div>
        <div v-if="searchKeyword" class="search-summary">
          <span class="result-count">找到 {{ filteredUsers.length }} 个匹配的用户</span>
          <button class="clear-search-btn" @click="clearSearch">
            <i class="fas fa-times"></i> 清除搜索
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">
          用户列表
          <span v-if="filteredUsers.length !== userStore.users.length" class="result-count">
            (显示 {{ filteredUsers.length }} / 共 {{ userStore.users.length }} 个用户)
          </span>
        </div>
        <div>
          <button class="btn btn-outline">导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>状态</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id"
                :class="{ 'highlighted': user.id === highlightedUserId }"
              >
                <td>#{{ user.id }}</td>
                <td>
                  <div class="user-cell">
                    <div class="table-avatar">{{ user.name.charAt(0) }}</div>
                    {{ user.name }}
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <span class="status" :class="`status-${user.status}`">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td>{{ user.createTime }}</td>
                <td>
                  <button class="btn btn-primary" @click="editUser(user)">编辑</button>
                  <button class="btn btn-outline" @click="deleteUser(user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredUsers.length === 0 && searchKeyword" class="no-results">
            <i class="fas fa-search"></i>
            <h3>没有找到匹配的用户</h3>
            <p>没有找到与 "{{ searchKeyword }}" 相关的用户</p>
            <div class="suggestions">
              <p>建议：</p>
              <ul>
                <li>检查搜索词拼写</li>
                <li>尝试使用其他关键词</li>
                <li>减少搜索条件</li>
              </ul>
            </div>
            <button class="btn btn-primary" @click="clearSearch">显示所有用户</button>
          </div>
          <div v-else-if="filteredUsers.length === 0" class="no-results">
            <i class="fas fa-users"></i>
            <h3>暂无用户数据</h3>
            <p>系统中还没有用户，请添加第一个用户</p>
            <button class="btn btn-primary" @click="showAddModal = true">
              <i class="fas fa-plus"></i> 添加用户
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加用户模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>添加用户</h3>
          <button class="close-btn" @click="showAddModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitUser">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="newUser.name" required>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="newUser.email" required>
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="newUser.role" required>
                <option value="用户">用户</option>
                <option value="编辑">编辑</option>
                <option value="管理员">管理员</option>
              </select>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="newUser.status" required>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
                <option value="pending">待审核</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="showAddModal = false">取消</button>
              <button type="submit" class="btn btn-primary">添加</button>
            </div>
          </form>
        </div>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  name: 'Users',
  setup() {
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()
    const showAddModal = ref(false)
    const highlightedUserId = ref(null)
    const localSearchQuery = ref('')
    const showError = ref(false)
    const errorMessage = ref('')
    
    const searchKeyword = computed(() => route.query.search || '')
    const highlightUserId = computed(() => route.query.highlight ? parseInt(route.query.highlight) : null)
    
    const newUser = reactive({
      name: '',
      email: '',
      role: '用户',
      status: 'active'
    })
    
    // 过滤用户列表
    const filteredUsers = computed(() => {
      if (!searchKeyword.value) {
        return userStore.users
      }
      
      const keyword = searchKeyword.value.toLowerCase()
      return userStore.users.filter(user => 
        user.name.toLowerCase().includes(keyword) || 
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword)
      )
    })
    
    const getStatusText = (status) => {
      const statusMap = {
        active: '活跃',
        inactive: '停用',
        pending: '待审核'
      }
      return statusMap[status] || status
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
    
    // 本地搜索处理
    const handleLocalSearch = () => {
      if (!localSearchQuery.value.trim()) {
        showErrorMessage('请输入搜索关键词')
        return
      }
      
      const results = userStore.searchUsers(localSearchQuery.value)
      if (results.length === 0) {
        showErrorMessage(`没有找到匹配的用户: "${localSearchQuery.value}"`)
        return
      }
      
      router.push({
        path: '/users',
        query: { search: localSearchQuery.value }
      })
    }
    
    const submitUser = () => {
      userStore.addUser({ ...newUser })
      showAddModal.value = false
      // 重置表单
      Object.assign(newUser, {
        name: '',
        email: '',
        role: '用户',
        status: 'active'
      })
    }
    
    const editUser = (user) => {
      // 实现编辑逻辑
      console.log('编辑用户:', user)
    }
    
    const deleteUser = (id) => {
      if (confirm('确定要删除这个用户吗？')) {
        userStore.deleteUser(id)
      }
    }
    
    const clearSearch = () => {
      localSearchQuery.value = ''
      router.push({ path: '/users' })
    }
    
    // 监听路由变化，同步本地搜索词
    watch(searchKeyword, (newVal) => {
      localSearchQuery.value = newVal
    }, { immediate: true })
    
    // 监听高亮用户ID变化
    watch(highlightUserId, (newId) => {
      highlightedUserId.value = newId
      
      // 3秒后取消高亮
      if (newId) {
        setTimeout(() => {
          highlightedUserId.value = null
          // 移除URL中的highlight参数但保留search
          if (route.query.search) {
            router.replace({ 
              path: '/users', 
              query: { search: route.query.search } 
            })
          } else {
            router.replace({ path: '/users' })
          }
        }, 3000)
      }
    }, { immediate: true })
    
    return {
      userStore,
      showAddModal,
      newUser,
      searchKeyword,
      filteredUsers,
      highlightedUserId,
      localSearchQuery,
      showError,
      errorMessage,
      getStatusText,
      submitUser,
      editUser,
      deleteUser,
      clearSearch,
      handleLocalSearch,
      showErrorMessage
    }
  }
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: var(--card-bg);
  font-weight: 600;
  color: var(--text-color);
}

tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

tr.highlighted {
  background-color: rgba(58, 123, 213, 0.1);
  animation: highlight-fade 3s ease-out;
}

@keyframes highlight-fade {
  0% {
    background-color: rgba(58, 123, 213, 0.3);
  }
  100% {
    background-color: rgba(58, 123, 213, 0.1);
  }
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-active {
  background-color: rgba(46, 204, 113, 0.2);
  color: var(--success);
}

.status-pending {
  background-color: rgba(243, 156, 18, 0.2);
  color: var(--warning);
}

.status-inactive {
  background-color: rgba(231, 76, 60, 0.2);
  color: var(--danger);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  margin-left: 5px;
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
}

.user-cell {
  display: flex;
  align-items: center;
}

.table-avatar {
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
  margin-right: 8px;
}

.search-indicator {
  color: var(--primary);
  font-weight: 500;
}

.clear-search {
  background: none;
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 0.8rem;
}

.clear-search:hover {
  background-color: var(--primary);
  color: white;
}

.result-count {
  font-size: 0.9rem;
  color: var(--gray);
  font-weight: normal;
  margin-left: 10px;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 25px;
}

.search-container {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
  margin-bottom: 10px;
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
  padding: 12px 0;
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
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-button:hover {
  background: #2a69c4;
}

.search-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--gray);
  font-size: 0.9rem;
}

.clear-search-btn {
  background: none;
  border: 1px solid var(--gray);
  color: var(--gray);
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.clear-search-btn:hover {
  background-color: var(--gray);
  color: white;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray);
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ddd;
}

.no-results h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.no-results p {
  margin-bottom: 20px;
}

.suggestions {
  margin: 20px 0;
  text-align: left;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.suggestions ul {
  margin-top: 10px;
  padding-left: 20px;
}

.suggestions li {
  margin-bottom: 5px;
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--card-bg);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>