<template>
  <div class="detections">
    <div class="page-header">
      <div class="page-title">
        <h1>检测管理</h1>
        <div class="breadcrumb">
          <a href="#">首页</a> / <span>检测管理</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" @click="refreshHistory" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i> 
          {{ isLoading ? '加载中...' : '刷新列表' }}
        </button>
        <button class="btn btn-primary" @click="showUploadModal = true">
          <i class="fas fa-plus"></i> 新建检测
        </button>
      </div>
    </div>

    <!-- 实时状态卡片 -->
    <div class="status-cards">
      <div class="status-card" :class="{ online: serviceOnline, offline: !serviceOnline }">
        <div class="status-icon">
          <i class="fas" :class="serviceOnline ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
        </div>
        <div class="status-info">
          <h4>检测服务状态</h4>
          <p>{{ serviceOnline ? '运行正常' : '服务离线' }}</p>
        </div>
      </div>
      <div class="status-card">
        <div class="status-icon">
          <i class="fas fa-camera"></i>
        </div>
        <div class="status-info">
          <h4>总检测数量</h4>
          <p>{{ detectionStore.totalDetections.toLocaleString() }} 次</p>
        </div>
      </div>
      <div class="status-card">
        <div class="status-icon">
          <i class="fas fa-bolt"></i>
        </div>
        <div class="status-info">
          <h4>今日检测</h4>
          <p>{{ detectionStore.todayDetections }} 次</p>
        </div>
      </div>
    </div>

    <!-- 当前检测结果 -->
    <div v-if="detectionStore.currentDetection" class="current-detection card">
      <div class="card-header">
        <div class="card-title">当前检测结果</div>
        <button class="btn btn-sm btn-outline" @click="detectionStore.clearCurrentDetection()">
          清除
        </button>
      </div>
      <div class="card-body">
        <div class="detection-result">
          <div class="result-image">
            <img :src="detectionStore.currentDetection.thumbnail" 
                 :alt="detectionStore.currentDetection.filename" />
            <!-- 检测框覆盖层 -->
            <div class="detection-overlay">
              <div v-for="detection in detectionStore.currentDetection.detectionData.detections" 
                   :key="detection.id"
                   class="bounding-box"
                   :style="{
                     left: (detection.bbox[0] / detectionStore.currentDetection.detectionData.image_size[1] * 100) + '%',
                     top: (detection.bbox[1] / detectionStore.currentDetection.detectionData.image_size[0] * 100) + '%',
                     width: ((detection.bbox[2] - detection.bbox[0]) / detectionStore.currentDetection.detectionData.image_size[1] * 100) + '%',
                     height: ((detection.bbox[3] - detection.bbox[1]) / detectionStore.currentDetection.detectionData.image_size[0] * 100) + '%'
                   }">
                <div class="box-label">{{ detection.class }} ({{ (detection.confidence * 100).toFixed(1) }}%)</div>
              </div>
            </div>
          </div>
          <div class="result-details">
            <h4>检测详情</h4>
            <div class="detail-item">
              <span class="label">文件名:</span>
              <span class="value">{{ detectionStore.currentDetection.filename }}</span>
            </div>
            <div class="detail-item">
              <span class="label">检测时间:</span>
              <span class="value">{{ detectionStore.currentDetection.time }}</span>
            </div>
            <div class="detail-item">
              <span class="label">检测对象:</span>
              <span class="value">{{ detectionStore.currentDetection.objects }} 个</span>
            </div>
            <div class="detail-item">
              <span class="label">推理时间:</span>
              <span class="value">{{ detectionStore.currentDetection.detectionData.inference_time?.toFixed(2) || 'N/A' }} ms</span>
            </div>
            
            <div class="objects-list">
              <h5>检测到的对象:</h5>
              <div v-for="detection in detectionStore.currentDetection.detectionData.detections" 
                   :key="detection.id"
                   class="object-item">
                <span class="object-class">{{ detection.class }}</span>
                <span class="object-confidence">{{ (detection.confidence * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测记录 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          检测记录
          <span class="record-count">(共 {{ detectionStore.detectionHistory.length }} 条记录)</span>
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter">
            <option value="">全部状态</option>
            <option value="completed">已完成</option>
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
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>正在加载检测记录...</p>
        </div>
        
        <div v-else-if="filteredDetections.length === 0" class="no-detections">
          <i class="fas fa-camera"></i>
          <h3>暂无检测记录</h3>
          <p>系统中还没有检测记录</p>
          <button class="btn btn-primary" @click="showUploadModal = true">
            <i class="fas fa-play-circle"></i> 开始第一次检测
          </button>
        </div>
        
        <div v-else class="detection-list">
          <div class="detection-item" 
               v-for="detection in filteredDetections" 
               :key="detection.id"
               @click="viewDetection(detection.id)">
            <div class="detection-image">
              <img :src="detection.thumbnail" :alt="detection.filename" />
              <div class="detection-overlay">
                <span class="object-count">{{ detection.objects }}个对象</span>
              </div>
              <div v-if="detection.status === 'failed'" class="error-badge">
                <i class="fas fa-exclamation-triangle"></i>
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
              <div v-if="detection.error" class="error-message">
                {{ detection.error }}
              </div>
            </div>
            <div class="detection-actions">
              <button class="btn btn-sm btn-primary" @click.stop="viewDetection(detection.id)">
                查看结果
              </button>
              <button class="btn btn-sm btn-outline" @click.stop="downloadResult(detection.id)">
                下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传检测模态框和检测详情模态框保持不变 -->
    <!-- ... 原有的模态框代码 ... -->
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDetectionStore } from '../stores/detection'

export default {
  name: 'Detections',
  setup() {
    const detectionStore = useDetectionStore()
    const showUploadModal = ref(false)
    const selectedDetection = ref(null)
    const statusFilter = ref('')
    const dateFilter = ref('')
    const selectedFile = ref(null)
    const previewUrl = ref('')
    const isDragging = ref(false)
    const uploadError = ref('')
    const fileInput = ref(null)
    const serviceOnline = ref(true)
    const isLoading = ref(false)

    // 过滤检测记录
    const filteredDetections = computed(() => {
      let detections = detectionStore.getDetectionHistory()
      
      if (statusFilter.value) {
        detections = detections.filter(d => d.status === statusFilter.value)
      }
      
      // 这里可以添加时间过滤逻辑
      if (dateFilter.value === 'today') {
        const today = new Date().toDateString()
        detections = detections.filter(d => new Date(d.uploadTime).toDateString() === today)
      }
      
      return detections
    })

    // 检查服务状态
    const checkServiceStatus = async () => {
      serviceOnline.value = await detectionStore.checkServiceHealth()
    }

    // 刷新检测历史
    const refreshHistory = async () => {
      isLoading.value = true
      try {
        await detectionStore.fetchDetectionHistory()
        await detectionStore.fetchServiceStats() // 同时更新统计数据
      } catch (error) {
        console.error('刷新检测历史失败:', error)
      } finally {
        isLoading.value = false
      }
    }

    // 查看检测详情
    const viewDetection = (id) => {
      selectedDetection.value = detectionStore.getDetectionById(id)
    }

    // 下载结果
    const downloadResult = (id) => {
      const detection = detectionStore.getDetectionById(id)
      if (detection && detection.detectionData) {
        const dataStr = JSON.stringify(detection.detectionData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `detection_${id}_results.json`
        link.click()
        URL.revokeObjectURL(url)
      }
    }

    // 初始化
    onMounted(async () => {
      await checkServiceStatus()
      
      // 加载检测历史
      if (serviceOnline.value) {
        await refreshHistory()
      }
      
      // 每30秒自动刷新一次
      const interval = setInterval(() => {
        if (serviceOnline.value) {
          refreshHistory()
        }
      }, 30000)
      
      onUnmounted(() => {
        clearInterval(interval)
      })
    })

    return {
      detectionStore,
      showUploadModal,
      selectedDetection,
      statusFilter,
      dateFilter,
      selectedFile,
      previewUrl,
      isDragging,
      uploadError,
      fileInput,
      serviceOnline,
      isLoading,
      filteredDetections,
      refreshHistory,
      viewDetection,
      downloadResult
    }
  }
}
</script>

<style scoped>
/* 添加新的样式 */
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.record-count {
  font-size: 0.9rem;
  color: var(--gray);
  font-weight: normal;
  margin-left: 10px;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray);
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 15px;
}

/* 其他样式保持不变 */
/* ... */
</style>