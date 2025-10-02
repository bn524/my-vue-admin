<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3><i class="fas fa-cloud-upload-alt"></i> 上传图片进行检测</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
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
          
          <div v-if="!selectedFile && !isDetecting" class="upload-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>点击或拖拽图片到这里</p>
            <span class="upload-hint">支持 JPG、PNG 格式，最大 10MB</span>
          </div>
          
          <div v-else-if="isDetecting" class="detecting-placeholder">
            <div class="spinner"></div>
            <p>正在检测中...</p>
            <span class="detecting-hint">请稍候，AI正在分析图片</span>
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
          <button class="btn btn-outline" @click="$emit('close')">取消</button>
          <button class="btn btn-primary" 
                  @click="handleUpload" 
                  :disabled="!selectedFile || isDetecting">
            <span v-if="isDetecting">
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
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'UploadModal',
  props: {
    isDetecting: Boolean
  },
  emits: ['close', 'upload'],
  setup(props, { emit }) {
    const selectedFile = ref(null)
    const previewUrl = ref('')
    const isDragging = ref(false)
    const uploadError = ref('')
    const fileInput = ref(null)

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        validateAndSetFile(file)
      }
    }

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

    const validateAndSetFile = (file) => {
      uploadError.value = ''
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        uploadError.value = '只支持 JPG、PNG 格式的图片'
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        uploadError.value = '文件大小不能超过 10MB'
        return
      }
      
      selectedFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const removeFile = () => {
      selectedFile.value = null
      previewUrl.value = ''
      uploadError.value = ''
    }

    const handleUpload = () => {
      if (!selectedFile.value) return
      
      emit('upload', selectedFile.value)
    }

    return {
      selectedFile,
      previewUrl,
      isDragging,
      uploadError,
      fileInput,
      handleFileSelect,
      handleDragOver,
      handleDrop,
      triggerFileInput,
      removeFile,
      handleUpload
    }
  }
}
</script>

<style scoped>
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
  padding: 20px;
}

.modal {
  background-color: var(--card-bg);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 30px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  background: var(--card-bg);
}

.upload-area.is-dragging {
  border-color: var(--primary);
  background: rgba(58, 123, 213, 0.05);
}

.upload-area.has-file {
  border-color: var(--success);
  background: rgba(46, 204, 113, 0.05);
  padding: 30px;
}

.upload-placeholder i {
  font-size: 4rem;
  color: var(--gray);
  margin-bottom: 20px;
}

.upload-placeholder p {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--text-color);
  font-weight: 500;
}

.upload-hint {
  color: var(--gray);
  font-size: 0.9rem;
}

.detecting-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.detecting-placeholder p {
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 500;
  margin: 0;
}

.detecting-hint {
  color: var(--gray);
  font-size: 0.9rem;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.file-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-info {
  flex: 1;
  text-align: left;
}

.filename {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
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
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.remove-file:hover {
  background: #c0392b;
}

.error-message {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  color: var(--danger);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

@media (max-width: 576px) {
  .modal {
    margin: 0;
    border-radius: 0;
    height: 100%;
  }
  
  .file-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .file-info {
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>