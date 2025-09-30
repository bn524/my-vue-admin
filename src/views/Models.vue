<template>
  <div class="models">
    <div class="page-header">
      <div class="page-title">
        <h1>模型管理</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>模型管理</span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click="uploadModel">
          <i class="fas fa-upload"></i> 上传模型
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">YOLOv8 模型列表</div>
      </div>
      <div class="card-body">
        <div class="model-list">
          <div class="model-item" v-for="model in models" :key="model.id">
            <div class="model-icon">
              <i class="fas fa-cube"></i>
            </div>
            <div class="model-info">
              <div class="model-name">{{ model.name }}</div>
              <div class="model-version">版本: {{ model.version }}</div>
              <div class="model-meta">
                <span class="model-size">{{ model.size }}</span>
                <span class="model-accuracy">准确率: {{ model.accuracy }}</span>
              </div>
            </div>
            <div class="model-status">
              <span class="status-badge" :class="model.status">{{ model.statusText }}</span>
            </div>
            <div class="model-actions">
              <button 
                class="btn btn-sm" 
                :class="model.isActive ? 'btn-primary' : 'btn-outline'"
                @click="toggleModel(model.id)"
              >
                {{ model.isActive ? '使用中' : '启用' }}
              </button>
              <button class="btn btn-sm btn-outline" @click="downloadModel(model.id)">
                下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">模型性能统计</div>
      </div>
      <div class="card-body">
        <div class="performance-stats">
          <div class="stat-item">
            <div class="stat-value">95.6%</div>
            <div class="stat-label">平均准确率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">45ms</div>
            <div class="stat-label">平均检测时间</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">80</div>
            <div class="stat-label">检测类别数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">12.5K</div>
            <div class="stat-label">总检测次数</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Models',
  setup() {
    const models = ref([
      {
        id: 1,
        name: 'YOLOv8n',
        version: 'v8.0.0',
        size: '6.2MB',
        accuracy: '95.6%',
        status: 'active',
        statusText: '使用中',
        isActive: true
      },
      {
        id: 2,
        name: 'YOLOv8s',
        version: 'v8.0.0',
        size: '22.5MB',
        accuracy: '97.2%',
        status: 'inactive',
        statusText: '可用',
        isActive: false
      },
      {
        id: 3,
        name: 'YOLOv8m',
        version: 'v8.0.0',
        size: '49.7MB',
        accuracy: '98.1%',
        status: 'inactive',
        statusText: '可用',
        isActive: false
      },
      {
        id: 4,
        name: 'YOLOv8l',
        version: 'v8.0.0',
        size: '83.7MB',
        accuracy: '98.5%',
        status: 'inactive',
        statusText: '可用',
        isActive: false
      }
    ])
    
    const uploadModel = () => {
      console.log('上传模型')
    }
    
    const toggleModel = (id) => {
      models.value.forEach(model => {
        if (model.id === id) {
          model.isActive = true
          model.status = 'active'
          model.statusText = '使用中'
        } else {
          model.isActive = false
          model.status = 'inactive'
          model.statusText = '可用'
        }
      })
    }
    
    const downloadModel = (id) => {
      console.log('下载模型:', id)
    }
    
    return {
      models,
      uploadModel,
      toggleModel,
      downloadModel
    }
  }
}
</script>

<style scoped>
.model-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.model-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.model-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.model-info {
  flex: 1;
}

.model-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: var(--text-color);
}

.model-version {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 5px;
}

.model-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: var(--gray);
}

.status-badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(46, 204, 113, 0.2);
  color: var(--success);
}

.status-badge.inactive {
  background-color: rgba(149, 165, 166, 0.2);
  color: var(--gray);
}

.model-actions {
  display: flex;
  gap: 8px;
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--gray);
}
</style>