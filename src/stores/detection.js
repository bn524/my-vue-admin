import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import DetectionService from '../services/api'

export const useDetectionStore = defineStore('detection', () => {
  // 检测统计数据
  const totalDetections = ref(0)
  const todayDetections = ref(0)
  const detectionAccuracy = ref(0.956)
  const detectedCategories = ref(80)
  
  // 检测历史记录 - 从后端获取
  const detectionHistory = ref([])
  
  // 当前检测状态
  const isDetecting = ref(false)
  const currentDetection = ref(null)
  const detectionError = ref(null)
  
  // 热门检测类别（动态计算）
  const topCategories = computed(() => {
    // 从所有检测记录中统计类别数量
    const categoryCount = {}
    
    detectionHistory.value.forEach(record => {
      record.detectionData?.detections?.forEach(detection => {
        const className = detection.class
        if (categoryCount[className]) {
          categoryCount[className]++
        } else {
          categoryCount[className] = 1
        }
      })
    })
    
    // 转换为数组并排序（取前5名）
    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item, index, array) => {
        const total = array.reduce((sum, i) => sum + i.count, 0)
        return {
          ...item,
          percentage: total ? Math.round((item.count / total) * 100) : 0
        }
      })
  })
  
  // 最近检测记录 - 从后端获取
  const recentDetections = ref([])

  // 计算属性
  const dailyAverage = computed(() => Math.round(totalDetections.value / 30))
  const weeklyGrowth = computed(() => 12.5)

  // 从后端获取检测历史
  const fetchDetectionHistory = async (limit = 50) => {
    try {
      const response = await DetectionService.getDetectionHistory(0, limit)
      
      // 转换数据格式以适应前端
      const history = response.records.map(record => ({
        id: record.id,
        filename: record.filename,
        thumbnail: record.thumbnail_url 
          ? `http://localhost:8000${record.thumbnail_url}` 
          : 'https://via.placeholder.com/60x60/667eea/ffffff?text=IMG',
        objects: record.detection_count,  // 单条记录的对象数量
        time: formatTime(record.upload_time),
        status: 'completed',
        statusText: '已完成',
        detectionData: {
          detections: record.detection_results,  // 具体检测信息
          image_size: record.image_size.split(',').map(Number).reverse(),
          inference_time: record.inference_time
        },
        uploadTime: record.upload_time
      }))
      
      detectionHistory.value = history
      recentDetections.value = history.slice(0, 10)
      
      // 更新统计数据
      totalDetections.value = response.total
      
      // 计算今日检测数量（基于实际记录）
      const today = new Date().toISOString().split('T')[0]
      todayDetections.value = history.filter(
        record => record.upload_time.split('T')[0] === today
      ).length
      
      return history
    } catch (error) {
      console.error('获取检测历史失败:', error)
      throw error
    }
  }

  // 时间格式化函数
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    
    return date.toLocaleDateString()
  }

  // 检测方法
  const detectImage = async (file) => {
    isDetecting.value = true
    detectionError.value = null
    
    try {
      const response = await DetectionService.detectImage(file)
      
      // 创建检测记录
      const detectionRecord = {
        id: response.record_id,
        filename: file.name,
        thumbnail: URL.createObjectURL(file),
        objects: response.count,  // 本次检测的对象数量
        time: '刚刚',
        status: 'completed',
        statusText: '已完成',
        detectionData: response,  // 包含具体检测信息
        uploadTime: new Date().toISOString()
      }
      
      // 添加到历史记录开头
      detectionHistory.value.unshift(detectionRecord)
      recentDetections.value.unshift(detectionRecord)
      
      // 更新统计
      totalDetections.value++
      
      // 刷新今日统计（确保准确性）
      const today = new Date().toISOString().split('T')[0]
      todayDetections.value = detectionHistory.value.filter(
        record => record.upload_time.split('T')[0] === today
      ).length
      
      currentDetection.value = detectionRecord
      return detectionRecord
      
    } catch (error) {
      detectionError.value = error.message
      
      // 创建失败记录
      const failedRecord = {
        id: Date.now(),
        filename: file.name,
        thumbnail: URL.createObjectURL(file),
        objects: 0,
        time: '刚刚',
        status: 'failed',
        statusText: '检测失败',
        error: error.message,
        uploadTime: new Date().toISOString()
      }
      
      detectionHistory.value.unshift(failedRecord)
      recentDetections.value.unshift(failedRecord)
      throw error
      
    } finally {
      isDetecting.value = false
    }
  }

  // 获取检测历史
  const getDetectionHistory = (limit = 50) => {
    return detectionHistory.value.slice(0, limit)
  }

  // 根据ID获取检测记录
  const getDetectionById = (id) => {
    return detectionHistory.value.find(record => record.id === id)
  }

  // 清除当前检测
  const clearCurrentDetection = () => {
    currentDetection.value = null
    detectionError.value = null
  }

  // 获取模型信息
  const fetchModelInfo = async () => {
    try {
      return await DetectionService.getModelInfo()
    } catch (error) {
      console.error('获取模型信息失败:', error)
      throw error
    }
  }

  // 获取服务状态
  const fetchServiceStats = async () => {
    try {
      const stats = await DetectionService.getServiceStats()
      
      // 更新本地统计数据（与后端同步）
      totalDetections.value = stats.total_detections || totalDetections.value
      todayDetections.value = stats.today_detections || todayDetections.value
      detectedCategories.value = stats.detection_categories || detectedCategories.value
      
      return stats
    } catch (error) {
      console.error('获取服务状态失败:', error)
      throw error
    }
  }

  // 检查服务健康状态
  const checkServiceHealth = async () => {
    try {
      await DetectionService.healthCheck()
      return true
    } catch (error) {
      console.error('服务健康检查失败:', error)
      return false
    }
  }

  return {
    // 状态
    totalDetections,
    todayDetections,
    detectionAccuracy,
    detectedCategories,
    detectionHistory,
    isDetecting,
    currentDetection,
    detectionError,
    topCategories,
    recentDetections,
    
    // 计算属性
    dailyAverage,
    weeklyGrowth,
    
    // 方法
    detectImage,
    fetchDetectionHistory,
    getDetectionHistory,
    getDetectionById,
    clearCurrentDetection,
    fetchModelInfo,
    fetchServiceStats,
    checkServiceHealth
  }
})
