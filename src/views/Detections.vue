<template>
  <div class="detections">
    <div class="page-header">
      <div class="page-title">
        <h1>检测管理</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>检测管理</span>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click="startNewDetection">
          <i class="fas fa-plus"></i> 新建检测
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">检测记录</div>
        <div class="filter-controls">
          <select v-model="statusFilter">
            <option value="">全部状态</option>
            <option value="completed">已完成</option>
            <option value="processing">处理中</option>
            <option value="failed">失败</option>
          </select>
          <select v-model="dateFilter">
            <option value="">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div class="detection-grid">
          <div class="detection-card" v-for="detection in filteredDetections" :key="detection.id">
            <div class="detection-image">
              <img :src="detection.thumbnail" :alt="detection.filename" />
              <div class="detection-overlay">
                <span class="object-count">{{ detection.objects }}个对象</span>
              </div>
            </div>
            <div class="detection-info">
              <div class="detection-filename">{{ detection.filename }}</div>
              <div class="detection-meta">
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ detection.time }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-tag"></i>
                  <span class="detection-status" :class="'status-' + detection.status">
                    {{ detection.statusText }}
                  </span>
                </div>
              </div>
            </div>
            <div class="detection-actions">
              <button class="btn btn-sm btn-primary" @click="viewDetection(detection.id)">
                查看结果
              </button>
              <button class="btn btn-sm btn-outline" @click="downloadResult(detection.id)">
                下载
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredDetections.length === 0" class="no-detections">
          <i class="fas fa-camera"></i>
          <h3>暂无检测记录</h3>
          <p>开始您的第一次目标检测</p>
          <button class="btn btn-primary" @click="startNewDetection">
            <i class="fas fa-play-circle"></i> 开始检测
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useDetectionStore } from '../stores/detection'

export default {
  name: 'Detections',
  setup() {
    const detectionStore = useDetectionStore()
    const statusFilter = ref('')
    const dateFilter = ref('')
    
    const filteredDetections = computed(() => {
      let detections = detectionStore.recentDetections
      
      if (statusFilter.value) {
        detections = detections.filter(d => d.status === statusFilter.value)
      }
      
      return detections
    })
    
    const startNewDetection = () => {
      console.log('开始新的检测')
    }
    
    const viewDetection = (id) => {
      console.log('查看检测结果:', id)
    }
    
    const downloadResult = (id) => {
      console.log('下载检测结果:', id)
    }
    
    return {
      detectionStore,
      statusFilter,
      dateFilter,
      filteredDetections,
      startNewDetection,
      viewDetection,
      downloadResult
    }
  }
}
</script>

<style scoped>
.detection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.detection-card {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}

.detection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.detection-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.detection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: 10px;
}

.object-count {
  background: var(--primary);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.detection-info {
  padding: 15px;
}

.detection-filename {
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detection-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: var(--gray);
}

.detection-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-completed {
  background-color: rgba(46, 204, 113, 0.2);
  color: var(--success);
}

.status-processing {
  background-color: rgba(243, 156, 18, 0.2);
  color: var(--warning);
}

.status-failed {
  background-color: rgba(231, 76, 60, 0.2);
  color: var(--danger);
}

.detection-actions {
  padding: 0 15px 15px;
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-controls select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: var(--card-bg);
  color: var(--text-color);
}

.no-detections {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
}

.no-detections i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-detections h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.no-detections p {
  margin-bottom: 25px;
}
</style>