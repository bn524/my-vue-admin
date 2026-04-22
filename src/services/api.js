import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`发起请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('请求配置错误:', error)
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
    
    let message = '网络错误'
    
    if (error.code === 'ECONNREFUSED') {
      message = '无法连接到后端服务，请检查：\n1. 后端服务是否启动\n2. 端口号是否正确\n3. 网络连接是否正常'
    } else if (error.response) {
      // 服务器返回了错误状态码
      message = error.response.data?.detail || `服务器错误: ${error.response.status}`
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = '网络请求超时或服务器无响应'
    } else {
      message = error.message || '未知错误'
    }
    
    throw new Error(message)
  }
)

// API服务类
class DetectionService {
  // 健康检查
  async healthCheck() {
    try {
      return await apiClient.get('/')
    } catch (error) {
      console.error('健康检查失败:', error.message)
      throw error
    }
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
      },
      timeout: 60000 // 检测可能需要更长时间
    })
  }

  // 获取服务统计
  async getServiceStats() {
    return await apiClient.get('/stats')
  }
}

export default new DetectionService()