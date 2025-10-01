<template>
  <div class="detections">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">
            <i class="fas fa-camera"></i>
          </div>
          <div class="title-text">
            <h1>检测管理</h1>
            <p>管理所有图像检测任务和结果</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary btn-lg" @click="showUploadModal = true">
            <i class="fas fa-plus"></i>
            <span>新建检测</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 服务状态卡片 -->
    <div class="status-overview">
      <div class="status-card">
        <div class="status-icon success">
          <i class="fas fa-server"></i>
        </div>
        <div class="status-content">
          <h3>检测服务</h3>
          <p :class="serviceOnline ? 'online' : 'offline'">
            {{ serviceOnline ? '运行正常' : '服务离线' }}
          </p>
        </div>
      </div>
      <div class="status-card">
        <div class="status-icon info">
          <i class="fas fa-bolt"></i>
        </div>
        <div class="status-content">
          <h3>模型版本</h3>
          <p>YOLOv8n</p>
        </div>
      </div>
      <div class="status-card">
        <div class="status-icon warning">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="status-content">
          <h3>今日检测</h3>
          <p>{{ todayStats.detections }} 次</p>
        </div>
      </div>
      <div class="status-card">
        <div class="status-card">
          <div class="status-icon primary">
            <i class="fas fa-object-group"></i>
          </div>
          <div class="status-content">
            <h3>检测对象</h3>
            <p>{{ todayStats.objects }} 个</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前检测结果 -->
    <div v-if="detectionStore.currentDetection" class="current-detection-section">
      <div class="section-header">
        <h2><i class="fas fa-play-circle"></i> 当前检测结果</h2>
        <button class="btn btn-outline" @click="detectionStore.clearCurrentDetection()">
          <i class="fas fa-times"></i> 清除
        </button>
      </div>
      <div class="current-detection-card">
        <div class="detection-visual">
          <div class="image-container">
            <img :src="detectionStore.currentDetection.thumbnail" 
                 :alt="detectionStore.currentDetection.filename" />
            <div class="detection-overlay">
              <div v-for="detection in detectionStore.currentDetection.detectionData.detections" 
                   :key="detection.id"
                   class="bounding-box"
                   :style="getBoundingBoxStyle(detection, detectionStore.currentDetection.detectionData.image_size)">
                <div class="box-label">{{ detection.class }} ({{ (detection.confidence * 100).toFixed(1) }}%)</div>
              </div>
            </div>
          </div>
        </div>
        <div class="detection-details">
          <div class="detail-card">
            <div class="detail-header">
              <i class="fas fa-info-circle"></i>
              <h4>检测详情</h4>
            </div>
            <div class="detail-list">
              <div class="detail-item">
                <div class="detail-label">
                  <i class="fas fa-file-image"></i>
                  <span>文件名</span>
                </div>
                <div class="detail-value">{{ detectionStore.currentDetection.filename }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <i class="fas fa-clock"></i>
                  <span>检测时间</span>
                </div>
                <div class="detail-value">{{ detectionStore.currentDetection.time }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <i class="fas fa-cube"></i>
                  <span>检测对象</span>
                </div>
                <div class="detail-value">
                  <span class="badge badge-primary">{{ detectionStore.currentDetection.objects }} 个</span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <i class="fas fa-tachometer-alt"></i>
                  <span>推理时间</span>
                </div>
                <div class="detail-value">{{ detectionStore.currentDetection.detectionData.inference_time?.toFixed(2) || 'N/A' }} ms</div>
              </div>
            </div>
          </div>
          
          <div class="objects-card">
            <div class="detail-header">
              <i class="fas fa-list"></i>
              <h4>检测对象列表</h4>
            </div>
            <div class="objects-list">
              <div v-for="detection in detectionStore.currentDetection.detectionData.detections" 
                   :key="detection.id"
                   class="object-item">
                <div class="object-info">
                  <span class="object-class">{{ detection.class }}</span>
                  <span class="object-confidence">{{ (detection.confidence * 100).toFixed(1) }}%</span>
                </div>
                <div class="object-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: (detection.confidence * 100) + '%'}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测记录 -->
    <div class="detection-history-section">
      <div class="section-header">
        <h2><i class="fas fa-history"></i> 检测记录</h2>
        <div class="filter-controls">
          <div class="filter-group">
            <label><i class="fas fa-filter"></i> 状态筛选</label>
            <select v-model="statusFilter" class="filter-select">
              <option value="">全部状态</option>
              <option value="completed">已完成</option>
              <option value="processing">处理中</option>
              <option value="failed">失败</option>
            </select>
          </div>
          <div class="filter-group">
            <label><i class="fas fa-calendar"></i> 时间筛选</label>
            <select v-model="dateFilter" class="filter-select">
              <option value="">全部时间</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
          </div>
          <div class="search-group">
            <div class="search-input">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="搜索文件名..." v-model="searchQuery">
            </div>
          </div>
        </div>
      </div>

      <div class="detection-grid">
        <div class="detection-card" 
             v-for="detection in filteredDetections" 
             :key="detection.id"
             @click="viewDetection(detection.id)">
          <div class="card-header">
            <div class="file-info">
              <i class="fas fa-file-image"></i>
              <span class="filename">{{ detection.filename }}</span>
            </div>
            <div class="status-badge" :class="'status-' + detection.status">
              {{ detection.statusText }}
            </div>
          </div>
          <div class="card-image">
            <img :src="detection.thumbnail" :alt="detection.filename" />
            <div class="image-overlay">
              <span class="object-count">{{ detection.objects }} 个对象</span>
              <div class="action-buttons">
                <button class="btn-icon" @click.stop="viewDetection(detection.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" @click.stop="downloadResult(detection.id)">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div v-if="detection.status === 'failed'" class="error-indicator">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div class="card-footer">
            <div class="meta-info">
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ detection.time }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-cube"></i>
                <span>{{ detection.objects }} 对象</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredDetections.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-camera"></i>
        </div>
        <h3>暂无检测记录</h3>
        <p>开始您的第一次目标检测</p>
        <button class="btn btn-primary" @click="showUploadModal = true">
          <i class="fas fa-play-circle"></i> 开始检测
        </button>
      </div>
    </div>

    <!-- 上传检测模态框 -->
    <UploadModal 
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleFileUpload"
      :isDetecting="detectionStore.isDetecting"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDetectionStore } from '../stores/detection'
import UploadModal from '../components/UploadModal.vue'

export default {
  name: 'Detections',
  components: {
    UploadModal
  },
  setup() {
    const detectionStore = useDetectionStore()
    const showUploadModal = ref(false)
    const statusFilter = ref('')
    const dateFilter = ref('')
    const searchQuery = ref('')
    const serviceOnline = ref(true)
    const todayStats = ref({
      detections: 0,
      objects: 0
    })

    // 计算过滤后的检测记录
    const filteredDetections = computed(() => {
      let detections = detectionStore.getDetectionHistory()
      
      // 状态过滤
      if (statusFilter.value) {
        detections = detections.filter(d => d.status === statusFilter.value)
      }
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        detections = detections.filter(d => 
          d.filename.toLowerCase().includes(query)
        )
      }
      
      return detections
    })

    // 获取边界框样式
    const getBoundingBoxStyle = (detection, imageSize) => {
      const [height, width] = imageSize
      return {
        left: (detection.bbox[0] / width * 100) + '%',
        top: (detection.bbox[1] / height * 100) + '%',
        width: ((detection.bbox[2] - detection.bbox[0]) / width * 100) + '%',
        height: ((detection.bbox[3] - detection.bbox[1]) / height * 100) + '%'
      }
    }

    // 检查服务状态
    const checkServiceStatus = async () => {
      serviceOnline.value = await detectionStore.checkServiceHealth()
    }

    // 加载今日统计
    const loadTodayStats = async () => {
      try {
        const stats = await detectionStore.fetchServiceStats()
        todayStats.value = {
          detections: stats.today_detections || 0,
          objects: 150 // 这里可以根据实际数据调整
        }
      } catch (error) {
        console.error('加载统计失败:', error)
      }
    }

    // 查看检测详情
    const viewDetection = (id) => {
      const detection = detectionStore.getDetectionById(id)
      if (detection) {
        detectionStore.currentDetection = detection
      }
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

    // 处理文件上传
    const handleFileUpload = async (file) => {
      try {
        await detectionStore.detectImage(file)
        showUploadModal.value = false
        // 重新加载统计
        loadTodayStats()
      } catch (error) {
        console.error('检测失败:', error)
      }
    }

    // 初始化
    onMounted(() => {
      checkServiceStatus()
      loadTodayStats()
      
      // 每30秒检查一次服务状态
      const interval = setInterval(() => {
        checkServiceStatus()
        loadTodayStats()
      }, 30000)
      
      onUnmounted(() => {
        clearInterval(interval)
      })
    })

    return {
      detectionStore,
      showUploadModal,
      statusFilter,
      dateFilter,
      searchQuery,
      serviceOnline,
      todayStats,
      filteredDetections,
      getBoundingBoxStyle,
      viewDetection,
      downloadResult,
      handleFileUpload
    }
  }
}
</script>

<style scoped>
.detections {
  padding: 0;
}

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 0 0 20px 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.title-text h1 {
  font-size: 2.2rem;
  margin-bottom: 5px;
  font-weight: 700;
}

.title-text p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 状态概览 */
.status-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 0 30px;
}

.status-card {
  background: var(--card-bg);
  padding: 25px;
  border-radius: 15px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.status-icon.success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.status-icon.info {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.status-icon.warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.status-icon.primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.status-content h3 {
  margin-bottom: 8px;
  color: var(--text-color);
  font-size: 1.1rem;
}

.status-content p {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-color);
}

.status-content p.online {
  color: var(--success);
}

.status-content p.offline {
  color: var(--danger);
}

/* 区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 30px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
  font-size: 1.5rem;
}

.section-header h2 i {
  color: var(--primary);
}

/* 当前检测结果 */
.current-detection-section {
  margin-bottom: 40px;
}

.current-detection-card {
  background: var(--card-bg);
  margin: 0 30px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.detection-visual {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.image-container {
  position: relative;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
}

.detection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bounding-box {
  position: absolute;
  border: 3px solid #ff4757;
  background: rgba(255, 71, 87, 0.1);
  pointer-events: none;
  transition: all 0.3s;
}

.bounding-box:hover {
  background: rgba(255, 71, 87, 0.2);
}

.box-label {
  position: absolute;
  top: -32px;
  left: 0;
  background: #ff4757;
  color: white;
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 6px;
  white-space: nowrap;
  font-weight: 500;
}

.detection-details {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-card, .objects-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.detail-header i {
  color: var(--primary);
  font-size: 1.2rem;
}

.detail-header h4 {
  margin: 0;
  font-size: 1.2rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-weight: 500;
}

.detail-label i {
  color: var(--primary);
  width: 16px;
}

.detail-value {
  color: var(--gray);
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-primary {
  background: var(--primary);
  color: white;
}

.objects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.object-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.object-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.object-class {
  font-weight: 500;
  color: var(--text-color);
}

.object-confidence {
  color: var(--success);
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 筛选控件 */
.filter-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.8rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  min-width: 120px;
}

.search-group {
  display: flex;
  align-items: flex-end;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input i {
  position: absolute;
  left: 12px;
  color: var(--gray);
}

.search-input input {
  padding: 8px 12px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  width: 200px;
}

/* 检测网格 */
.detection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  padding: 0 30px;
}

.detection-card {
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.detection-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
}

.file-info i {
  color: var(--primary);
}

.filename {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-completed {
  background: rgba(46, 204, 113, 0.2);
  color: var(--success);
}

.status-processing {
  background: rgba(243, 156, 18, 0.2);
  color: var(--warning);
}

.status-failed {
  background: rgba(231, 76, 60, 0.2);
  color: var(--danger);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.detection-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.detection-card:hover .image-overlay {
  opacity: 1;
}

.object-count {
  background: var(--primary);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: white;
  transform: scale(1.1);
}

.error-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--danger);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.card-footer {
  padding: 15px 20px 20px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--gray);
}

.meta-item i {
  width: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 30px;
  color: var(--gray);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
  color: var(--primary);
}

.empty-state h3 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.empty-state p {
  margin-bottom: 25px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .current-detection-card {
    grid-template-columns: 1fr;
  }
  
  .detection-visual {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .status-overview,
  .section-header,
  .detection-grid {
    padding: 0 20px;
  }
  
  .current-detection-card {
    margin: 0 20px;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .detection-grid {
    grid-template-columns: 1fr;
  }
  
  .status-overview {
    grid-template-columns: 1fr;
  }
}
</style>