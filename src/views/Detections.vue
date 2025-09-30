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
          <i class="fas fa-bolt"></i>
        </div>
        <div class="status-info">
          <h4>模型版本</h4>
          <p>YOLOv8n</p>
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
        <div class="detection-list">
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
        <div v-if="filteredDetections.length === 0" class="no-detections">
          <i class="fas fa-camera"></i>
          <h3>暂无检测记录</h3>
          <p>开始您的第一次目标检测</p>
          <button class="btn btn-primary" @click="showUploadModal = true">
            <i class="fas fa-play-circle"></i> 开始检测
          </button>
        </div>
      </div>
    </div>

    <!-- 上传检测模态框 -->
    <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>上传图片进行检测</h3>
          <button class="close-btn" @click="showUploadModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="upload-area" 
               @drop="handleDrop"
               @dragover="handleDragOver"
               @click="triggerFileInput"
               :class="{ 'is-dragging': isDragging, 'has-file': selectedFile }">
            <input type="file" 
                   ref="fileInput"
                   @change="handleFileSelect"
                   accept="image/jpeg,image/png,image/jpg" 
                   style="display: none" />
            
            <div v-if="!selectedFile" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>点击或拖拽图片到这里</p>
              <span class="upload-hint">支持 JPG、PNG 格式，最大 10MB</span>
            </div>
            
            <div v-else class="file-preview">
              <img :src="previewUrl" :alt="selectedFile.name" />
              <div class="file-info">
                <div class="filename">{{ selectedFile.name }}</div>
                <div class="filesize">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</div>
              </div>
              <button class="remove-file" @click.stop="removeFile">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div v-if="uploadError" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ uploadError }}
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-outline" @click="showUploadModal = false">取消</button>
            <button class="btn btn-primary" 
                    @click="startDetection" 
                    :disabled="!selectedFile || detectionStore.isDetecting">
              <span v-if="detectionStore.isDetecting">
                <i class="fas fa-spinner fa-spin"></i> 检测中...
              </span>
              <span v-else>
                <i class="fas fa-play"></i> 开始检测
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 检测详情模态框 -->
    <div v-if="selectedDetection" class="modal-overlay" @click.self="selectedDetection = null">
      <div class="modal large">
        <div class="modal-header">
          <h3>检测详情</h3>
          <button class="close-btn" @click="selectedDetection = null">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detection-detail">
            <div class="detail-image">
              <img :src="selectedDetection.thumbnail" :alt="selectedDetection.filename" />
              <!-- 检测框覆盖层 -->
              <div class="detection-overlay">
                <div v-for="detection in selectedDetection.detectionData.detections" 
                     :key="detection.id"
                     class="bounding-box"
                     :style="{
                       left: (detection.bbox[0] / selectedDetection.detectionData.image_size[1] * 100) + '%',
                       top: (detection.bbox[1] / selectedDetection.detectionData.image_size[0] * 100) + '%',
                       width: ((detection.bbox[2] - detection.bbox[0]) / selectedDetection.detectionData.image_size[1] * 100) + '%',
                       height: ((detection.bbox[3] - detection.bbox[1]) / selectedDetection.detectionData.image_size[0] * 100) + '%'
                     }">
                  <div class="box-label">{{ detection.class }} ({{ (detection.confidence * 100).toFixed(1) }}%)</div>
                </div>
              </div>
            </div>
            <div class="detail-info">
              <h4>检测信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>文件名:</label>
                  <span>{{ selectedDetection.filename }}</span>
                </div>
                <div class="info-item">
                  <label>上传时间:</label>
                  <span>{{ new Date(selectedDetection.uploadTime).toLocaleString() }}</span>
                </div>
                <div class="info-item">
                  <label>检测对象数:</label>
                  <span>{{ selectedDetection.objects }} 个</span>
                </div>
                <div class="info-item">
                  <label>推理时间:</label>
                  <span>{{ selectedDetection.detectionData.inference_time?.toFixed(2) || 'N/A' }} ms</span>
                </div>
                <div class="info-item">
                  <label>图片尺寸:</label>
                  <span>{{ selectedDetection.detectionData.image_size[1] }} × {{ selectedDetection.detectionData.image_size[0] }}</span>
                </div>
              </div>
              
              <div class="objects-section">
                <h5>检测对象列表</h5>
                <div class="objects-table">
                  <div class="table-header">
                    <span>类别</span>
                    <span>置信度</span>
                    <span>边界框</span>
                  </div>
                  <div v-for="detection in selectedDetection.detectionData.detections" 
                       :key="detection.id"
                       class="table-row">
                    <span class="class-name">{{ detection.class }}</span>
                    <span class="confidence">{{ (detection.confidence * 100).toFixed(1) }}%</span>
                    <span class="bbox">[{{ detection.bbox.map(num => num.toFixed(1)).join(', ') }}]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

    // 过滤检测记录
    const filteredDetections = computed(() => {
      let detections = detectionStore.getDetectionHistory()
      
      if (statusFilter.value) {
        detections = detections.filter(d => d.status === statusFilter.value)
      }
      
      // 这里可以添加时间过滤逻辑
      
      return detections
    })

    // 检查服务状态
    const checkServiceStatus = async () => {
      serviceOnline.value = await detectionStore.checkServiceHealth()
    }

    // 文件选择处理
    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        validateAndSetFile(file)
      }
    }

    // 拖拽处理
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragging.value = true
    }

    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      
      const files = event.dataTransfer.files
      if (files.length > 0) {
        validateAndSetFile(files[0])
      }
    }

    // 文件验证和设置
    const validateAndSetFile = (file) => {
      uploadError.value = ''
      
      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        uploadError.value = '只支持 JPG、PNG 格式的图片'
        return
      }
      
      // 检查文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        uploadError.value = '文件大小不能超过 10MB'
        return
      }
      
      selectedFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }

    // 触发文件输入
    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    // 移除文件
    const removeFile = () => {
      selectedFile.value = null
      previewUrl.value = ''
      uploadError.value = ''
    }

    // 开始检测
    const startDetection = async () => {
      if (!selectedFile.value) return
      
      try {
        await detectionStore.detectImage(selectedFile.value)
        showUploadModal.value = false
        removeFile()
      } catch (error) {
        uploadError.value = error.message
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
    onMounted(() => {
      checkServiceStatus()
      // 每30秒检查一次服务状态
      const interval = setInterval(checkServiceStatus, 30000)
      
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
      filteredDetections,
      handleFileSelect,
      handleDragOver,
      handleDrop,
      triggerFileInput,
      removeFile,
      startDetection,
      viewDetection,
      downloadResult
    }
  }
}
</script>

<style scoped>
.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.status-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border-left: 4px solid #ddd;
}

.status-card.online {
  border-left-color: var(--success);
}

.status-card.offline {
  border-left-color: var(--danger);
}

.status-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.status-card.online .status-icon {
  color: var(--success);
}

.status-card.offline .status-icon {
  color: var(--danger);
}

.status-info h4 {
  margin-bottom: 5px;
  color: var(--text-color);
}

.status-info p {
  color: var(--gray);
  font-size: 0.9rem;
}

.current-detection {
  margin-bottom: 25px;
}

.detection-result {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.result-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.result-image img {
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
  border: 2px solid #ff4757;
  background: rgba(255, 71, 87, 0.1);
  pointer-events: none;
}

.box-label {
  position: absolute;
  top: -25px;
  left: 0;
  background: #ff4757;
  color: white;
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 3px;
  white-space: nowrap;
}

.result-details {
  padding: 10px 0;
}

.result-details h4 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-item .label {
  font-weight: 500;
  color: var(--text-color);
}

.detail-item .value {
  color: var(--gray);
}

.objects-list {
  margin-top: 20px;
}

.objects-list h5 {
  margin-bottom: 10px;
  color: var(--text-color);
}

.object-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.object-class {
  font-weight: 500;
}

.object-confidence {
  color: var(--success);
  font-weight: 500;
}

.detection-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detection-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.detection-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detection-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
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
  padding: 5px;
}

.object-count {
  background: var(--primary);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.error-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: var(--danger);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.detection-info {
  flex: 1;
}

.detection-filename {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detection-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
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

.error-message {
  color: var(--danger);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.detection-actions {
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

/* 上传区域样式 */
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.upload-area.is-dragging {
  border-color: var(--primary);
  background: rgba(58, 123, 213, 0.05);
}

.upload-area.has-file {
  border-color: var(--success);
  background: rgba(46, 204, 113, 0.05);
  padding: 20px;
}

.upload-placeholder i {
  font-size: 3rem;
  color: var(--gray);
  margin-bottom: 15px;
}

.upload-placeholder p {
  margin-bottom: 8px;
  color: var(--text-color);
  font-weight: 500;
}

.upload-hint {
  color: var(--gray);
  font-size: 0.9rem;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.file-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.file-info {
  flex: 1;
  text-align: left;
}

.filename {
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-color);
}

.filesize {
  color: var(--gray);
  font-size: 0.9rem;
}

.remove-file {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--danger);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模态框样式 */
.modal.large {
  max-width: 900px;
}

.detection-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.detail-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.detail-image img {
  width: 100%;
  height: auto;
  display: block;
}

.detail-info h4 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.info-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item label {
  font-weight: 500;
  color: var(--text-color);
}

.info-item span {
  color: var(--gray);
}

.objects-section h5 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.objects-table {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  background: #f8f9fa;
  padding: 12px 15px;
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid #eee;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.class-name {
  font-weight: 500;
}

.confidence {
  color: var(--success);
  font-weight: 500;
}

.bbox {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--gray);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .detection-result {
    grid-template-columns: 1fr;
  }
  
  .detection-detail {
    grid-template-columns: 1fr;
  }
  
  .detection-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detection-actions {
    align-self: flex-end;
  }
  
  .file-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .file-info {
    text-align: center;
  }
}
</style>