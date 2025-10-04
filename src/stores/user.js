import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 示例用户数据（核心添加部分）
  const users = ref([
    {
      id: 1,
      name: 'admin',
      email: 'admin@example.com',
      role: '管理员',
      avatar: 'https://via.placeholder.com/40/409eff/ffffff?text=AD',
      createTime: '2024-01-10'
    },
    {
      id: 2,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '普通用户',
      avatar: 'https://via.placeholder.com/40/67c23a/ffffff?text=张',
      createTime: '2024-02-15'
    },
    {
      id: 3,
      name: '李四',
      email: 'lisi@example.com',
      role: '普通用户',
      avatar: 'https://via.placeholder.com/40/ee9a00/ffffff?text=李',
      createTime: '2024-03-20'
    },
    {
      id: 4,
      name: '王五',
      email: 'wangwu@example.com',
      role: '只读用户',
      avatar: 'https://via.placeholder.com/40/909399/ffffff?text=王',
      createTime: '2024-04-05'
    },
    {
      id: 5,
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: '普通用户',
      avatar: 'https://via.placeholder.com/40/f56c6c/ffffff?text=赵',
      createTime: '2024-05-12'
    }
  ])

  // 原有主题管理功能（未修改）
  const currentTheme = ref('light')
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }

  // 原有用户搜索功能（未修改，自动适配示例用户）
  const searchUsers = (query) => {
    if (!query.trim()) {
      return [...users.value]
    }
    const lowerQuery = query.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery)
    )
  }

  // 新增：获取单个用户（可选，用于用户详情页）
  const getUserById = (id) => {
    return users.value.find(user => user.id === id)
  }

  return {
    users,
    currentTheme,
    toggleTheme,
    searchUsers,
    getUserById
  }
})
