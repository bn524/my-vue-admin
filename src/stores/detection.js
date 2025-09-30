import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import DetectionService from '../services/api'

export const useDetectionStore = defineStore('detection', () => {
  // 检测统计数据
  const totalDetections = ref(12580)
  const todayDetections = ref(324)
  const detectionAccuracy = ref(0.956)
  const detectedCategories = ref(80)
  
  // 检测历史记录
  const detectionHistory = ref([])
  
  // 当前检测状态
  const isDetecting = ref(false)
  const currentDetection = ref(null)
  const detectionError = ref(null)
  
  // 热门检测类别
  const topCategories = ref([
    { name: '人物', count: 4520, percentage: 36 },
    { name: '车辆', count: 3210, percentage: 25 },
    { name: '动物', count: 1980, percentage: 16 },
    { name: '家具', count: 1250, percentage: 10 },
    { name: '其他', count: 1620, percentage: 13 }
  ])
  
  // 最近检测记录
  const recentDetections = ref([
    {
      id: 1,
      filename: 'street_scene.jpg',
      thumbnail: 'https://via.placeholder.com/60x60/667eea/ffffff?text=SC',
      objects: 12,
      time: '10分钟前',
      status: 'completed',
      statusText: '已完成',
      detectionData: null
    }
  ])

  // 计算属性
  const dailyAverage = computed(() => Math.round(totalDetections.value / 30))
  const weeklyGrowth = computed(() => 12.5)

  // 检测方法
  const detectImage = async (file) => {
    isDetecting.value = true
    detectionError.value = null
    
    try {
      const response = await DetectionService.detectImage(file)
      
      // 创建检测记录
      const detectionRecord = {
        id: Date.now(),
        filename: file.name,
        thumbnail: URL.createObjectURL(file),
        objects: response.count,
        time: '刚刚',
        status: 'completed',
        statusText: '已完成',
        detectionData: response,
        uploadTime: new Date().toISOString()
      }
      
      // 添加到历史记录
      detectionHistory.value.unshift(detectionRecord)
      recentDetections.value.unshift(detectionRecord)
      
      // 更新统计
      totalDetections.value++
      todayDetections.value++
      
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
      return await DetectionService.getServiceStats()
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
    getDetectionHistory,
    getDetectionById,
    clearCurrentDetection,
    fetchModelInfo,
    fetchServiceStats,
    checkServiceHealth
  }
})