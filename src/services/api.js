import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`发起请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求错误:', error)
    const message = error.response?.data?.detail || error.message || '网络错误'
    throw new Error(message)
  }
)

// API服务类
class DetectionService {
  // 健康检查
  async healthCheck() {
    return await apiClient.get('/')
  }

  // 获取模型信息
  async getModelInfo() {
    return await apiClient.get('/model/info')
  }

  // 目标检测
  async detectImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return await apiClient.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // 获取检测历史
  async getDetectionHistory(skip = 0, limit = 50) {
    return await apiClient.get('/detections', {
      params: { skip, limit }
    })
  }

  // 获取特定检测记录详情
  async getDetectionDetail(recordId) {
    return await apiClient.get(`/detections/${recordId}`)
  }

  // 获取服务统计
  async getServiceStats() {
    return await apiClient.get('/stats')
  }
}

export default new DetectionService()