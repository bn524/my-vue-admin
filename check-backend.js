import axios from 'axios';
// 后续代码保持不变

async function checkBackend() {
  const endpoints = [
    'http://localhost:8000/',
    'http://127.0.0.1:8000/'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`正在测试: ${endpoint}`)
      const response = await axios.get(endpoint, { timeout: 5000 })
      console.log(`✅ 连接成功: ${endpoint}`)
      console.log('响应数据:', response.data)
      return endpoint
    } catch (error) {
      console.log(`❌ 连接失败: ${endpoint}`)
      console.log('错误信息:', error.message)
    }
  }
  
  console.log('\n🔧 故障排除建议:')
  console.log('1. 确保后端服务正在运行: python main.py')
  console.log('2. 检查端口是否被占用: netstat -an | grep 8000')
  console.log('3. 检查防火墙设置')
  console.log('4. 尝试修改后端绑定地址为 0.0.0.0')
  
  return null
}

checkBackend()