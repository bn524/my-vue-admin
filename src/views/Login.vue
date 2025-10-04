<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>检测系统管理后台</h2>
        <p>请登录后访问管理功能</p>
      </div>
      
      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="请输入用户名"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
            required
            class="form-input"
          />
        </div>
        
        <!-- 错误提示 -->
        <div v-if="loginError" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ loginError }}
        </div>
        
        <button type="submit" class="login-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">登录</span>
          <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin"></i> 登录中...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    // 表单数据
    const username = ref('')
    const password = ref('')
    // 状态控制
    const loginError = ref('')
    const isSubmitting = ref(false)
    
    // 处理登录提交
    const handleLogin = async () => {
      loginError.value = '' // 清空之前的错误
      isSubmitting.value = true
      
      try {
        // 调用Pinia的登录方法（前端静态验证）
        const loginSuccess = authStore.login(username.value, password.value)
        if (loginSuccess) {
          // 登录成功，跳转到管理首页（如dashboard）
          router.push('/dashboard')
        } else {
          // 登录失败，提示错误
          loginError.value = '用户名或密码错误（正确：admin/123456）'
        }
      } catch (error) {
        loginError.value = '登录过程出错，请重试'
        console.error('登录错误:', error)
      } finally {
        isSubmitting.value = false
      }
    }
    
    return {
      username,
      password,
      loginError,
      isSubmitting,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #1d2129;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #86909c;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1d2129;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.error-message {
  color: #f56c6c;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.login-btn {
  width: 100%;
  padding: 0.9rem;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background-color: #3391e8;
}
</style>