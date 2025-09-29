<template>
  <div class="users">
    <div class="page-header">
      <div class="page-title">
        <h1>用户管理</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>用户管理</span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <i class="fas fa-plus"></i> 添加用户
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">用户列表</div>
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
              <tr v-for="user in userStore.users" :key="user.id">
                <td>#{{ user.id }}</td>
                <td>{{ user.name }}</td>
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
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/user'

export default {
  name: 'Users',
  setup() {
    const userStore = useUserStore()
    const showAddModal = ref(false)
    
    const newUser = reactive({
      name: '',
      email: '',
      role: '用户',
      status: 'active'
    })
    
    const getStatusText = (status) => {
      const statusMap = {
        active: '活跃',
        inactive: '停用',
        pending: '待审核'
      }
      return statusMap[status] || status
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
    
    return {
      userStore,
      showAddModal,
      newUser,
      getStatusText,
      submitUser,
      editUser,
      deleteUser
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