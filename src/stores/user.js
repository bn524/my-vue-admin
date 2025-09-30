import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active', createTime: '2023-05-12' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: 'active', createTime: '2023-04-28' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: 'inactive', createTime: '2023-03-15' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '用户', status: 'pending', createTime: '2023-02-08' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', role: '编辑', status: 'active', createTime: '2023-06-10' },
    { id: 6, name: '孙八', email: 'sunba@example.com', role: '用户', status: 'active', createTime: '2023-05-22' }
  ])

  const currentTheme = ref('light')

  const addUser = (user) => {
    user.id = users.value.length + 1
    user.createTime = new Date().toISOString().split('T')[0]
    users.value.push(user)
  }

  const deleteUser = (id) => {
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  const updateUser = (id, updatedUser) => {
    const index = users.value.findIndex(user => user.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser }
    }
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const activeUsers = computed(() => users.value.filter(user => user.status === 'active').length)

  // 搜索用户方法
  const searchUsers = (query) => {
    if (!query.trim()) {
      return users.value
    }
    
    const keyword = query.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(keyword) || 
      user.email.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    )
  }

  return {
    users,
    currentTheme,
    activeUsers,
    addUser,
    deleteUser,
    updateUser,
    toggleTheme,
    searchUsers
  }
})