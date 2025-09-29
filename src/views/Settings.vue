<template>
  <div class="settings">
    <div class="page-header">
      <div class="page-title">
        <h1>系统设置</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>系统设置</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">主题设置</div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="setting-info">
            <h4>主题模式</h4>
            <p>切换明暗主题</p>
          </div>
          <div class="setting-action">
            <button class="btn btn-primary" @click="userStore.toggleTheme">
              {{ userStore.currentTheme === 'light' ? '切换到暗色模式' : '切换到亮色模式' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">系统信息</div>
      </div>
      <div class="card-body">
        <div class="system-info">
          <div class="info-item">
            <span class="label">系统版本:</span>
            <span class="value">v2.1.0</span>
          </div>
          <div class="info-item">
            <span class="label">Vue版本:</span>
            <span class="value">3.3.4</span>
          </div>
          <div class="info-item">
            <span class="label">最后更新:</span>
            <span class="value">2023-06-15</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
  name: 'Settings',
  setup() {
    const userStore = useUserStore()
    
    return {
      userStore
    }
  }
}
</script>

<style scoped>
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h4 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.setting-info p {
  color: var(--gray);
  font-size: 0.9rem;
}

.system-info {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
}

.label {
  font-weight: 600;
  width: 100px;
  color: var(--text-color);
}

.value {
  color: var(--gray);
}
</style>