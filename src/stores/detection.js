import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDetectionStore = defineStore('detection', () => {
  // 检测统计数据
  const totalDetections = ref(12580)
  const todayDetections = ref(324)
  const detectionAccuracy = ref(0.956)
  const detectedCategories = ref(80)
  
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
      statusText: '已完成'
    },
    {
      id: 2,
      filename: 'office_desk.png',
      thumbnail: 'https://via.placeholder.com/60x60/f093fb/ffffff?text=OD',
      objects: 8,
      time: '25分钟前',
      status: 'completed',
      statusText: '已完成'
    },
    {
      id: 3,
      filename: 'park_animals.jpeg',
      thumbnail: 'https://via.placeholder.com/60x60/4facfe/ffffff?text=PA',
      objects: 5,
      time: '1小时前',
      status: 'completed',
      statusText: '已完成'
    },
    {
      id: 4,
      filename: 'traffic_camera.mp4',
      thumbnail: 'https://via.placeholder.com/60x60/43e97b/ffffff?text=TC',
      objects: 23,
      time: '2小时前',
      status: 'processing',
      statusText: '处理中'
    }
  ])
  
  // 计算属性
  const dailyAverage = computed(() => Math.round(totalDetections.value / 30))
  const weeklyGrowth = computed(() => 12.5)
  
  // 方法
  const addDetection = (detection) => {
    totalDetections.value++
    todayDetections.value++
    recentDetections.value.unshift({
      id: Date.now(),
      ...detection,
      time: '刚刚',
      status: 'completed',
      statusText: '已完成'
    })
  }
  
  const updateAccuracy = (newAccuracy) => {
    detectionAccuracy.value = newAccuracy
  }
  
  const getDetectionStats = (period = '7d') => {
    const stats = {
      '7d': [125, 143, 118, 167, 189, 156, 201],
      '30d': Array.from({length: 30}, (_, i) => 100 + Math.floor(Math.random() * 120)),
      '90d': Array.from({length: 90}, (_, i) => 80 + Math.floor(Math.random() * 150))
    }
    return stats[period] || stats['7d']
  }
  
  return {
    totalDetections,
    todayDetections,
    detectionAccuracy,
    detectedCategories,
    topCategories,
    recentDetections,
    dailyAverage,
    weeklyGrowth,
    addDetection,
    updateAccuracy,
    getDetectionStats
  }
})